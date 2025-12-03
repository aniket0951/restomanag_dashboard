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

export interface Restaurant {
  id: string;
  name: string;
}

interface RestaurantStore {
  restaurant: Restaurant | null;

  setRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (restaurant: Partial<Restaurant>) => void;
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
      name: "admin-user-storage",
    },
  ),
);

export const restaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      restaurant: null,

      setRestaurant: (restaurant) =>
        set({
          restaurant,
        }),

      updateRestaurant: (restaurantData) =>
        set((state) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, ...restaurantData }
            : null,
        })),

      logout: () =>
        set({
          restaurant: null,
        }),
    }),
    {
      name: "resto_store",
    },
  ),
);
