import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
const IS_SUPABASE = Boolean(BASE_URL && SUPABASE_KEY)

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

apiClient.interceptors.request.use((config) => {
  if (IS_SUPABASE) {
    config.headers['apikey'] = SUPABASE_KEY
    config.headers['Authorization'] = `Bearer ${SUPABASE_KEY}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err),
)

export { apiClient, BASE_URL, IS_SUPABASE }