// Security utilities for input validation and sanitization

// Email validation with security considerations
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }

  const trimmedEmail = email.trim()
  
  // Check length to prevent potential DoS
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email address too long' }
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true }
}

// Password validation with security requirements
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password too long' }
  }

  // Check for at least one number and one letter
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter and one number' }
  }

  return { isValid: true }
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validate application data
export const validateApplicationData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required')
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  } else if (data.name.trim().length > 100) {
    errors.push('Name too long')
  }

  // Age validation
  if (!data.age || typeof data.age !== 'number') {
    errors.push('Age is required')
  } else if (data.age < 18 || data.age > 120) {
    errors.push('Age must be between 18 and 120')
  }

  // Address validation
  if (!data.address || typeof data.address !== 'string') {
    errors.push('Address is required')
  } else if (data.address.trim().length < 10) {
    errors.push('Please provide a complete address')
  } else if (data.address.trim().length > 500) {
    errors.push('Address too long')
  }

  // Annual income validation
  if (!data.annual_income || typeof data.annual_income !== 'string') {
    errors.push('Annual income is required')
  } else if (data.annual_income.trim().length > 50) {
    errors.push('Annual income format too long')
  }

  // Job description validation
  if (!data.job_description || typeof data.job_description !== 'string') {
    errors.push('Job description is required')
  } else if (data.job_description.trim().length < 10) {
    errors.push('Please provide a more detailed job description')
  } else if (data.job_description.trim().length > 1000) {
    errors.push('Job description too long')
  }

  return { isValid: errors.length === 0, errors }
}

// Rate limiting for client-side
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.attempts.get(key)

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count >= maxAttempts) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingTime(key: string): number {
    const entry = this.attempts.get(key)
    if (!entry) return 0
    return Math.max(0, entry.resetTime - Date.now())
  }
}

export const authRateLimiter = new RateLimiter()

// Secure error message handler
export const getSecureErrorMessage = (error: any): string => {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred'
  }

  // Map potentially sensitive errors to safe messages
  const errorMessage = error.message || error.toString()
  
  // Don't expose database errors or internal system details
  if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
    return 'This record already exists'
  }
  
  if (errorMessage.includes('permission denied') || errorMessage.includes('unauthorized')) {
    return 'You do not have permission to perform this action'
  }
  
  if (errorMessage.includes('connection') || errorMessage.includes('network')) {
    return 'Network connection error. Please try again'
  }
  
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again'
  }

  // For auth errors, return the message as Supabase auth errors are generally safe
  if (error.name === 'AuthError' || errorMessage.includes('Invalid login credentials')) {
    return errorMessage
  }

  // Default safe message
  return 'An error occurred. Please try again'
}

// Audit logging for security-sensitive operations
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  // In a production environment, this would send to a logging service
  console.log(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    ...details
  })
}