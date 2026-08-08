import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConfigured = Boolean(supabase)

export async function submitMessage(payload) {
  if (!supabase) {
    return { error: "Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di file .env" }
  }
  const { data, error } = await supabase
    .from('messages')
    .insert([payload])
    .select()
    .single()
  return { data, error }
}

export async function fetchMessages() {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase belum dikonfigurasi' } }
  }
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function updateMessageStatus(id, status) {
  if (!supabase) return { error: { message: 'Supabase belum dikonfigurasi' } }
  const { data, error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', id)
  return { data, error }
}

export async function signInAdmin(email, password) {
  if (!supabase) return { error: { message: 'Supabase belum dikonfigurasi' } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOutAdmin() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session)
  })
  return () => data.subscription.unsubscribe()
}