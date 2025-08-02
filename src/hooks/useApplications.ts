import { useState, useEffect } from 'react'
import { supabase, Database } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

type Application = Database['public']['Tables']['applications']['Row']
type ApplicationInsert = Database['public']['Tables']['applications']['Insert']

export const useApplications = (userId?: string) => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      let query = supabase.from('applications').select('*')
      
      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const submitApplication = async (applicationData: Omit<ApplicationInsert, 'user_id'>, userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...applicationData,
          user_id: userId,
        })
        .select()
        .single()
      
      if (error) throw error
      
      toast({
        title: "Application submitted!",
        description: "We've received your application and will review it shortly.",
      })
      
      // Refresh applications list
      await fetchApplications()
      
      return { data, error: null }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single()
      
      if (error) throw error
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${status}`,
      })
      
      // Refresh applications list
      await fetchApplications()
      
      return { data, error: null }
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: "Update failed",
        description: "Failed to update application status",
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [userId])

  return {
    applications,
    loading,
    submitApplication,
    updateApplicationStatus,
    refetch: fetchApplications,
  }
}