import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server client with cookie support
export const createServerClient = async () => {
  const cookieStore = await cookies()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value || null
        },
        setItem: (_key: string, _value: string) => {
          // Server-side cookies are read-only
        },
        removeItem: (_key: string) => {
          // Server-side cookies are read-only
        }
      }
    }
  })
}

// Default browser client for client-side usage
export const supabase = createBrowserClient()
