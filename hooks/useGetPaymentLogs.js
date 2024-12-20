import { useMutation } from "@tanstack/react-query";
import { paymentLogs } from "../api/transactions/paymentLogs";

export const useGetPaymentLogs = () => {
  return useMutation({
    mutationFn: (email) => paymentLogs(email),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("payment logs:", error);
    },
  });
};
