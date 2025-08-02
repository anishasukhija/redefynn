import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          address: string
          annual_income: number
          job_description: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          age: number
          address: string
          annual_income: number
          job_description: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          name?: string
          age?: number
          address?: string
          annual_income?: number
          job_description?: string
          status?: 'pending' | 'approved' | 'rejected'
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          first_name?: string | null
          last_name?: string | null
          email: string
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          email?: string
          updated_at?: string
        }
      }
    }
  }
}