// Content Security Policy configuration
import { SECURITY_CONFIG } from './security-config'

export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    // Only allow unsafe-inline and unsafe-eval in development
    ...(import.meta.env.NODE_ENV === 'development' ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
    "https://gnzcynuehkxbkfljaydx.supabase.co"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:"
  ],
  'connect-src': [
    "'self'",
    "https://gnzcynuehkxbkfljaydx.supabase.co",
    "wss://gnzcynuehkxbkfljaydx.supabase.co"
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
}

export const generateCSPHeader = (): string => {
  const isReportOnly = SECURITY_CONFIG.CSP.REPORT_ONLY
  const directive = isReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'
  
  let cspString = Object.entries(CSP_CONFIG)
    .filter(([, sources]) => sources.length > 0)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  // Add report-uri for CSP violations
  if (SECURITY_CONFIG.CSP.REPORT_URI) {
    cspString += `; report-uri ${SECURITY_CONFIG.CSP.REPORT_URI}`
  }
  
  return cspString
}

// Generate nonce for inline scripts (production only)
export const generateNonce = (): string => {
  if (import.meta.env.NODE_ENV === 'development') {
    return ''
  }
  
  // In a real application, this would be generated server-side
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

// CSP violation reporting handler
export const handleCSPViolation = (violationReport: any) => {
  console.warn('[CSP Violation]', violationReport)
  
  // In production, send to logging service
  if (import.meta.env.PROD && SECURITY_CONFIG.FEATURES.ERROR_REPORTING) {
    // Send to your logging service
    fetch('/api/csp-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(violationReport)
    }).catch(err => console.error('Failed to report CSP violation:', err))
  }
}
