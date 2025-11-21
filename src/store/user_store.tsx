// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "admin-user-storage", // localStorage key
    },
  ),
);
