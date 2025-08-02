import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { getSecureErrorMessage, logSecurityEvent } from '@/lib/security'

export interface ApplicationStats {
  state: string | null
  city: string | null
  application_count: number
  month_year: string | null
}

export const useApplicationStats = () => {
  const [stats, setStats] = useState<ApplicationStats[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .rpc('get_application_stats')

      if (error) throw error

      setStats((data as ApplicationStats[]) || [])
    } catch (error: any) {
      logSecurityEvent('stats_fetch_failed', { 
        user_id: user.id, 
        error: error.message 
      })

      toast({
        title: "Error fetching application statistics",
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchStats()
    } else {
      setStats([])
    }
  }, [user])

  return {
    stats,
    loading,
    fetchStats,
  }
}