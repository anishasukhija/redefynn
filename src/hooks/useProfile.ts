import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { getSecureErrorMessage, logSecurityEvent } from '@/lib/security'

export interface Profile {
  id: string
  user_id: string
  email: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error

      setProfile(data)
    } catch (error: any) {
      logSecurityEvent('profile_fetch_failed', { 
        user_id: user.id, 
        error: error.message 
      })

      toast({
        title: "Error fetching profile",
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  return {
    profile,
    loading,
    fetchProfile,
    isAdmin: profile?.is_admin || false,
  }
}