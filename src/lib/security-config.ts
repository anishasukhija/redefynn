// Security configuration and constants
export const SECURITY_CONFIG = {
  // Rate limiting settings
  RATE_LIMITS: {
    AUTH: {
      SIGNIN_ATTEMPTS: 5,
      SIGNIN_WINDOW: 15 * 60 * 1000, // 15 minutes
      SIGNUP_ATTEMPTS: 3,
      SIGNUP_WINDOW: 15 * 60 * 1000, // 15 minutes
      PASSWORD_RESET_ATTEMPTS: 3,
      PASSWORD_RESET_WINDOW: 60 * 60 * 1000, // 1 hour
    },
    API: {
      GENERAL_REQUESTS: 100,
      GENERAL_WINDOW: 60 * 1000, // 1 minute
      APPLICATION_SUBMIT: 3,
      APPLICATION_WINDOW: 60 * 60 * 1000, // 1 hour
    }
  },

  // Input validation limits
  INPUT_LIMITS: {
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    AGE_MIN: 18,
    AGE_MAX: 120,
    ADDRESS_MIN_LENGTH: 10,
    ADDRESS_MAX_LENGTH: 500,
    JOB_DESCRIPTION_MIN_LENGTH: 10,
    JOB_DESCRIPTION_MAX_LENGTH: 1000,
    ANNUAL_INCOME_MAX_LENGTH: 50,
    GENERAL_TEXT_MAX_LENGTH: 1000,
    HTML_CONTENT_MAX_LENGTH: 5000,
  },

  // Session and token settings
  SESSION: {
    TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '1800000'), // 30 minutes default
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    SECURE_COOKIES: import.meta.env.VITE_SECURE_COOKIES === 'true',
  },

  // Feature flags
  FEATURES: {
    CAPTCHA_ENABLED: import.meta.env.VITE_ENABLE_CAPTCHA === 'true',
    RATE_LIMITING_ENABLED: import.meta.env.VITE_RATE_LIMIT_ENABLED === 'true',
    SECURITY_LOGGING: true,
    TWO_FACTOR_AUTH: false, // Future feature
    CSP_ENABLED: import.meta.env.VITE_ENABLE_CSP === 'true',
    HSTS_ENABLED: import.meta.env.VITE_ENABLE_HSTS === 'true',
    ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  },

  // Error messages (safe for user display)
  ERROR_MESSAGES: {
    GENERIC: 'An unexpected error occurred. Please try again.',
    VALIDATION: 'Please check your input and try again.',
    AUTHENTICATION: 'Authentication failed. Please check your credentials.',
    AUTHORIZATION: 'You do not have permission to perform this action.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
    NETWORK: 'Network error. Please check your connection and try again.',
    SERVER: 'Server temporarily unavailable. Please try again later.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    CSRF_ERROR: 'Security error. Please refresh the page and try again.',
  },

  // Security event types for logging
  SECURITY_EVENTS: {
    USER_SIGNIN: 'user_signin',
    USER_SIGNUP: 'user_signup',
    USER_SIGNOUT: 'user_signout',
    PASSWORD_RESET_REQUEST: 'password_reset_request',
    INVALID_SESSION: 'invalid_session',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
    APPLICATION_SUBMITTED: 'application_submitted',
    ADMIN_ACTION: 'admin_action',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity',
    VALIDATION_ERROR: 'validation_error',
    CSP_VIOLATION: 'csp_violation',
    UNAUTHORIZED_ACCESS: 'unauthorized_access',
  },

  // Content Security Policy settings
  CSP: {
    REPORT_ONLY: import.meta.env.NODE_ENV === 'development',
    REPORT_URI: '/api/csp-report',
  }
}

// Environment validation
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required')
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required')
  }

  // Validate URL format
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must use HTTPS')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check if running in production
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.NODE_ENV === 'production'
}

// Check if running in development
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV === 'development'
}
