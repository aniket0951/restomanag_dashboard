import { persist } from "zustand/middleware";
import { create } from "zustand";
export interface SideBarState {
  open: boolean;
}

interface SideBarStore {
  sidebar: SideBarState | null;

  setSideBarState: (sidebar: SideBarState) => void;
}

export const useSideBarStore = create<SideBarStore>()(
  persist(
    (set) => ({
      sidebar: null,
      setSideBarState: (sidebar) =>
        set({
          sidebar,
        }),
    }),
    {
      name: "sibar-state",
    },
  ),
);
