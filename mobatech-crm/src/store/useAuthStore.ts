import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/api";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "hermina-crm-auth",
      // Avoid server-side hydration mismatches by returning a promise or handling it on mount
      skipHydration: true,
    }
  )
);
