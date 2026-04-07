import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  role: "STUDENT" | "PSYCHOLOGIST" | "SCHOOL_ADMIN" | "ADMIN" | "SUPER_ADMIN" | null;
  orgId: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setAuth: (data: {
    token: string;
    role: "STUDENT" | "PSYCHOLOGIST" | "SCHOOL_ADMIN" | "ADMIN" | "SUPER_ADMIN";
    orgId?: string | null;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      orgId: null,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setAuth: (data) => set(data),

      logout: () =>
        set({
          token: null,
          role: null,
          orgId: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        console.log("[AUTH STORE] Rehydrated state:", state);
        state?.setHydrated(true);
      },
    }
  )
);