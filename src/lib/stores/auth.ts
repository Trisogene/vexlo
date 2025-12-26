import type { Session, User } from "@supabase/supabase-js"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    setSession: (session) =>
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }),
    setLoading: (isLoading) => set({ isLoading }),
  })),
)
