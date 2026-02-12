import { create } from "zustand";
import type { ListOrdersByRestaurantAndStatusRes } from "../types/orders";

interface OrderStore {
  orders: ListOrdersByRestaurantAndStatusRes[];
  cachedTab: string | null;
  cachedPage: number | null;
  lastFetched: number | null;
  setOrders: (orders: ListOrdersByRestaurantAndStatusRes[], tab: string, page: number) => void;
  clearCache: () => void;
  isCacheValid: (tab: string, page: number, maxAge?: number) => boolean;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  cachedTab: null,
  cachedPage: null,
  lastFetched: null,
  setOrders: (orders, tab, page) =>
    set({
      orders,
      cachedTab: tab,
      cachedPage: page,
      lastFetched: Date.now(),
    }),
  clearCache: () =>
    set({
      orders: [],
      cachedTab: null,
      cachedPage: null,
      lastFetched: null,
    }),
  isCacheValid: (tab, page, maxAge = 60000) => {
    const state = get();
    if (!state.lastFetched) return false;
    if (state.cachedTab !== tab || state.cachedPage !== page) return false;
    return Date.now() - state.lastFetched < maxAge;
  },
}));
