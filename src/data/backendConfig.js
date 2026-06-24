export const BACKENDS = {
  local: 'localStorage',
  supabase: 'supabase',
}

export function getBackendConfig(env = import.meta.env) {
  const supabaseUrl = (env.VITE_SUPABASE_URL || '').trim()
  const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim()
  const requestedBackend = (env.VITE_DATA_BACKEND || 'auto').trim().toLowerCase()
  const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey)
  const wantsLocal = requestedBackend === 'local' || requestedBackend === 'localstorage'
  const wantsSupabase = requestedBackend === 'supabase'

  return {
    backend: !wantsLocal && (wantsSupabase || hasSupabaseCredentials) && hasSupabaseCredentials
      ? BACKENDS.supabase
      : BACKENDS.local,
    requestedBackend,
    hasSupabaseCredentials,
    supabaseUrl,
    supabaseAnonKey,
  }
}
