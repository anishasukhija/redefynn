import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

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
      const { data, error } = await supabase
        .from('application_stats')
        .select('*')
        .order('month_year', { ascending: false })

      if (error) throw error

      setStats(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching application statistics",
        description: error.message,
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