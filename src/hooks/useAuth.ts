import { useState, useEffect } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        })
      }
      
      return { data, error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Sign up failed",
        description: authError.message,
        variant: "destructive"
      })
      return { data: null, error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to Redefynn.",
      })
      
      return { data, error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Sign in failed",
        description: authError.message,
        variant: "destructive"
      })
      return { data: null, error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Sign out failed",
        description: authError.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}