import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// En desarrollo usamos localhost, en producción usamos la URL de la API
const supabaseUrl = '/api';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); // Debug

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-health-reminder-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'x-client-info': 'health-reminder-app'
    }
  }
});