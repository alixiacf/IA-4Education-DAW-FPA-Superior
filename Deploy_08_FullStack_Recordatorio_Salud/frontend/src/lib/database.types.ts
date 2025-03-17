export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reminders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          date: string
          location: string | null
          type: 'daily' | 'weekly' | 'monthly'
          is_active: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          date: string
          location?: string | null
          type: 'daily' | 'weekly' | 'monthly'
          is_active?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          date?: string
          location?: string | null
          type?: 'daily' | 'weekly' | 'monthly'
          is_active?: boolean
          user_id?: string
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          doctor_name: string
          specialty: string
          appointment_date: string
          location: string
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          doctor_name: string
          specialty: string
          appointment_date: string
          location: string
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          doctor_name?: string
          specialty?: string
          appointment_date?: string
          location?: string
          notes?: string | null
          user_id?: string
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          message: string
          type: 'email' | 'push' | 'whatsapp'
          status: 'pending' | 'sent' | 'read'
          reminder_id: string | null
          appointment_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          message: string
          type: 'email' | 'push' | 'whatsapp'
          status?: 'pending' | 'sent' | 'read'
          reminder_id?: string | null
          appointment_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          message?: string
          type?: 'email' | 'push' | 'whatsapp'
          status?: 'pending' | 'sent' | 'read'
          reminder_id?: string | null
          appointment_id?: string | null
          user_id?: string
        }
      }
    }
  }
}