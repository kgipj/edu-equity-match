import { createClient } from '@supabase/supabase-js'
import { getBackendConfig } from './backendConfig'

let client

export function getSupabaseClient(config = getBackendConfig()) {
  if (!config.hasSupabaseCredentials) return null
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  }
  return client
}
