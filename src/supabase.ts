import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_ADMIN_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_ADMIN_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing admin Supabase configuration. Set VITE_ADMIN_SUPABASE_URL and VITE_ADMIN_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
