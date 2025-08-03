// Security middleware for enhanced client-side security
import { SECURITY_CONFIG } from './security-config';
import { logSecurityEvent } from './security';

interface SecurityContext {
  sessionTimeout: number;
  lastActivity: number;
  warningShown: boolean;
}

class SecurityManager {
  private securityContext: SecurityContext;
  private warningTimer: NodeJS.Timeout | null = null;
  private logoutTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.securityContext = {
      sessionTimeout: SECURITY_CONFIG.SESSION.TIMEOUT,
      lastActivity: Date.now(),
      warningShown: false
    };

    this.initializeSecurityFeatures();
  }

  private initializeSecurityFeatures() {
    // Initialize session timeout monitoring
    this.startSessionMonitoring();

    // Initialize CSP violation reporting
    this.initializeCSPReporting();

    // Initialize activity tracking
    this.initializeActivityTracking();

    // Initialize security event listeners
    this.initializeSecurityEventListeners();
  }

  private startSessionMonitoring() {
    // Warning timer (5 minutes before logout)
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, this.securityContext.sessionTimeout - 5 * 60 * 1000);

    // Auto logout timer
    this.logoutTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.securityContext.sessionTimeout);
  }

  private showSessionWarning() {
    if (this.securityContext.warningShown) return;
    
    this.securityContext.warningShown = true;
    logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.INVALID_SESSION, {
      reason: 'session_warning_shown',
      remainingTime: 5 * 60 * 1000
    });

    // You can integrate with your toast system here
    console.warn('Session will expire in 5 minutes. Please save your work.');
  }

  private handleSessionTimeout() {
    logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.INVALID_SESSION, {
      reason: 'session_timeout'
    });

    // Clear all timers
    this.clearTimers();

    // Redirect to login or show modal
    window.location.href = '/login?reason=session_expired';
  }

  private initializeCSPReporting() {
    if (!SECURITY_CONFIG.FEATURES.CSP_ENABLED) return;

    document.addEventListener('securitypolicyviolation', (event) => {
      logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.CSP_VIOLATION, {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        lineNumber: event.lineNumber,
        sourceFile: event.sourceFile
      });

      // Report to server in production
      if (import.meta.env.PROD && SECURITY_CONFIG.FEATURES.ERROR_REPORTING) {
        fetch('/api/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'csp-report': {
              'document-uri': event.documentURI,
              'violated-directive': event.violatedDirective,
              'blocked-uri': event.blockedURI,
              'line-number': event.lineNumber,
              'source-file': event.sourceFile,
              'script-sample': event.sample
            }
          })
        }).catch(console.error);
      }
    });
  }

  private initializeActivityTracking() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      this.securityContext.lastActivity = Date.now();
      this.resetSessionTimers();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  private initializeSecurityEventListeners() {
    // Detect developer tools
    let devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
            type: 'developer_tools_opened',
            timestamp: Date.now()
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Detect right-click context menu (optional security measure)
    document.addEventListener('contextmenu', (e) => {
      if (import.meta.env.PROD && SECURITY_CONFIG.FEATURES.SECURITY_LOGGING) {
        logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          type: 'context_menu_accessed',
          target: e.target?.constructor?.name || 'unknown'
        });
      }
    });

    // Detect page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Page is hidden, pause timers or save state
        this.pauseSessionTimers();
      } else {
        // Page is visible, resume timers
        this.resumeSessionTimers();
      }
    });
  }

  private resetSessionTimers() {
    this.clearTimers();
    this.securityContext.warningShown = false;
    this.startSessionMonitoring();
  }

  private pauseSessionTimers() {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
  }

  private resumeSessionTimers() {
    this.resetSessionTimers();
  }

  private clearTimers() {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  // Public methods
  public refreshSession() {
    this.resetSessionTimers();
    logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.USER_SIGNIN, {
      type: 'session_refreshed'
    });
  }

  public destroy() {
    this.clearTimers();
    // Remove event listeners if needed
  }

  public getSecurityStatus() {
    return {
      sessionActive: Date.now() - this.securityContext.lastActivity < SECURITY_CONFIG.SESSION.INACTIVITY_TIMEOUT,
      lastActivity: this.securityContext.lastActivity,
      sessionTimeRemaining: this.securityContext.sessionTimeout - (Date.now() - this.securityContext.lastActivity)
    };
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Security validation functions
export const validateSecureContext = (): boolean => {
  // Check if running in secure context (HTTPS)
  if (import.meta.env.PROD && !window.isSecureContext) {
    logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
      type: 'insecure_context',
      protocol: window.location.protocol
    });
    return false;
  }
  return true;
};

export const detectTampering = (): boolean => {
  // Basic integrity checks
  try {
    // Check if critical functions have been modified
    if (typeof fetch !== 'function' || 
        typeof localStorage !== 'object' ||
        typeof sessionStorage !== 'object') {
      logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
        type: 'api_tampering_detected'
      });
      return true;
    }

    // Check for common attack vectors
    if (window.name.includes('javascript:') || 
        document.domain !== window.location.hostname) {
      logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
        type: 'potential_xss_detected'
      });
      return true;
    }

    return false;
  } catch (error) {
    logSecurityEvent(SECURITY_CONFIG.SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
      type: 'integrity_check_failed',
      error: error.message
    });
    return true;
  }
};

// Initialize security on module load
if (typeof window !== 'undefined') {
  // Validate secure context
  validateSecureContext();
  
  // Detect tampering
  detectTampering();
  
  // Initialize security manager
  securityManager;
}
