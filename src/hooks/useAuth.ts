import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { 
  validateEmail, 
  validatePassword, 
  authRateLimiter, 
  getSecureErrorMessage,
  logSecurityEvent 
} from '@/lib/security'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Input validation
      const emailValidation = validateEmail(email)
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error)
      }

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error)
      }

      // Rate limiting
      const rateLimitKey = `signup_${email.toLowerCase()}`
      if (!authRateLimiter.isAllowed(rateLimitKey, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(rateLimitKey) / 60000)
        throw new Error(`Too many signup attempts. Please wait ${remainingTime} minutes before trying again.`)
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      logSecurityEvent('user_signup_attempt', { email: email.toLowerCase().trim(), success: true })

      if (data?.user && !data?.user?.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete your registration.",
        })
      }

      return { data, error: null }
    } catch (error: any) {
      logSecurityEvent('user_signup_attempt', { 
        email: email?.toLowerCase()?.trim(), 
        success: false, 
        error: error.message 
      })

      toast({
        title: "Sign up failed",
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Input validation
      const emailValidation = validateEmail(email)
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error)
      }

      if (!password || password.length === 0) {
        throw new Error('Password is required')
      }

      // Rate limiting for sign in attempts
      const rateLimitKey = `signin_${email.toLowerCase()}`
      if (!authRateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(rateLimitKey) / 60000)
        logSecurityEvent('rate_limit_exceeded', { email: email.toLowerCase().trim(), action: 'signin' })
        throw new Error(`Too many login attempts. Please wait ${remainingTime} minutes before trying again.`)
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) throw error

      logSecurityEvent('user_signin', { email: email.toLowerCase().trim(), success: true })

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      return { data, error: null }
    } catch (error: any) {
      logSecurityEvent('user_signin', { 
        email: email?.toLowerCase()?.trim(), 
        success: false, 
        error: error.message 
      })

      toast({
        title: "Sign in failed", 
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      logSecurityEvent('user_signout', { success: true })

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error: any) {
      logSecurityEvent('user_signout', { success: false, error: error.message })

      toast({
        title: "Sign out failed",
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }
}