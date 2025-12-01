import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types';

interface AppStore extends AppState {
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setViewMode: (viewMode: 'grid' | 'list') => void;
  selectedCategoryId: string | null;
  selectedTagId: string | null;
  setSelectedCategory: (id: string | null) => void;
  setSelectedTag: (id: string | null) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,
      viewMode: 'grid',
      selectedCategoryId: null,
      selectedTagId: null,
      
      setDarkMode: (darkMode: boolean) => set({ darkMode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setViewMode: (viewMode: 'grid' | 'list') => set({ viewMode }),
      setSelectedCategory: (id: string | null) => set({ selectedCategoryId: id, selectedTagId: null }),
      setSelectedTag: (id: string | null) => set({ selectedTagId: id, selectedCategoryId: null }),
      clearFilters: () => set({ selectedCategoryId: null, selectedTagId: null }),
    }),
    {
      name: 'app-storage',
    }
  )
);