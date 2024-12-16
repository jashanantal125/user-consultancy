import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      userTempNumber: "",
      userEmail: "",
      hydrated: false,
      walletBalance: "",
      setUserTempNumber: (userTempNumber) => set({ userTempNumber }),
      setUserEmail: (userEmail) => set({ userEmail }),
      setHydrated: () => set({ hydrated: true }),
      setUserDetails: (details) => set({ userDetails: details }),
      setWalletBalance: (walletBalance) => set({ walletBalance }),
      clearEmail: () => set({ userEmail: null }),
    }),
    {
      name: "userEmail",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userEmail: state.userEmail }),
      onRehydrateStorage: () => () => {
        set({ hydrated: true });
      },
    }
  )
);
