import axios from "axios"
import { supabase } from "@/lib/supabase"

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
})

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login or refresh token)
      // Supabase client handles auto-refresh, but if it fails for API calls:
      console.error("Unauthorized API call")
    }
    return Promise.reject(error)
  },
)
