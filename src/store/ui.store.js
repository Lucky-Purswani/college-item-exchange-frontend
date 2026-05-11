import { create } from 'zustand'

export const useUIStore = create((set) => ({
  hideNavbar: false,
  setHideNavbar: (hideNavbar) => set({ hideNavbar }),
}))
