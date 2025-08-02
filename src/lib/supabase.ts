import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials - these should be available in Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Fallback for development - you'll need to replace these with your actual Supabase credentials
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-key'

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey
)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          address: string
          annual_income: string
          job_description: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          address: string
          annual_income: string
          job_description: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          address?: string
          annual_income?: string
          job_description?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}