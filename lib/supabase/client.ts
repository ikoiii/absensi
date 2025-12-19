import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Create a Supabase client for use in browser/client components
 * 
 * This client should be used in:
 * - Client Components
 * - Browser-side code
 * - React hooks
 * 
 * For Server Components and Server Actions, use @/lib/supabase/server.ts
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
