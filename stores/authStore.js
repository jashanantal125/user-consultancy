import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      apiKey: null,
      apiSecret: null,
      setApiKey: (apiKey) => set({ apiKey }),
      setApiSecret: (apiSecret) => set({ apiSecret }),
      clearAuth: () => set({ apiKey: null, apiSecret: null }),
    }),
    {
      name: "authToken",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
