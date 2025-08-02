import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export interface ApplicationData {
  id?: string
  name: string
  age: number
  address: string
  annual_income: string
  job_description: string
  status?: string
  created_at?: string
  updated_at?: string
}

export const useApplications = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchApplications = async (isAdmin = false) => {
    if (!user) return

    try {
      setLoading(true)
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      // If not admin, only show user's own applications
      if (!isAdmin) {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      setApplications(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitApplication = async (applicationData: Omit<ApplicationData, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an application.",
        variant: "destructive",
      })
      return { data: null, error: new Error("No user") }
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user.id,
            ...applicationData,
            status: 'submitted',
          }
        ])
        .select()
        .maybeSingle()

      if (error) throw error

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch within 48 hours.",
      })

      // Refresh the applications list
      fetchApplications()

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  return {
    applications,
    loading,
    submitApplication,
    fetchApplications,
  }
}