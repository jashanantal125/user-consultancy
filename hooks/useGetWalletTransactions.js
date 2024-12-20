import { useMutation } from "@tanstack/react-query";
import { walletTransactions } from "../api/transactions/walletTransactions";

export const useGetWalletTransactions = () => {
  return useMutation({
    mutationFn: (email) => walletTransactions(email),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("wallet logs:", error);
    },
  });
};
