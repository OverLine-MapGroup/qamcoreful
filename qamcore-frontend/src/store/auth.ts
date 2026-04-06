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
    orgId: string;
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
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);