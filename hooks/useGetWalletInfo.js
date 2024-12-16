import { useMutation } from "@tanstack/react-query";
import { walletInfo } from "../api/home/walletInfo";

export const useGetWalletInfo = () => {
  return useMutation({
    mutationFn: (credentials) => walletInfo(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("wallet info error:", error);
    },
  });
};
