import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { 
  validateApplicationData, 
  sanitizeInput, 
  getSecureErrorMessage,
  logSecurityEvent 
} from '@/lib/security'

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

  const fetchApplications = useCallback(async (isAdmin = false) => {
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
      logSecurityEvent('applications_fetch_failed', { 
        user_id: user.id, 
        is_admin: isAdmin,
        error: error.message 
      })

      toast({
        title: "Error fetching applications",
        description: getSecureErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

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

      // Validate application data
      const validation = validateApplicationData(applicationData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Sanitize text inputs
      const sanitizedData = {
        name: sanitizeInput(applicationData.name),
        age: applicationData.age,
        address: sanitizeInput(applicationData.address),
        annual_income: sanitizeInput(applicationData.annual_income),
        job_description: sanitizeInput(applicationData.job_description),
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user.id,
            ...sanitizedData,
            status: 'submitted',
          }
        ])
        .select()
        .maybeSingle()

      if (error) throw error

      logSecurityEvent('application_submitted', { 
        user_id: user.id, 
        application_id: data?.id 
      })

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch within 48 hours.",
      })

      // Refresh the applications list
      fetchApplications()

      return { data, error: null }
    } catch (error: any) {
      logSecurityEvent('application_submission_failed', { 
        user_id: user.id, 
        error: error.message 
      })

      toast({
        title: "Submission failed",
        description: getSecureErrorMessage(error),
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