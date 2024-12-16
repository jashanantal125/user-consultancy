import { useMutation } from "@tanstack/react-query";
import { endChat } from "../api/chat/endChat";
import { checkWalletBalance } from "../api/home/checkWalletBallance";

export const useCheckWalletBalance = () => {
  return useMutation({
    mutationFn: (payLoad) => checkWalletBalance(payLoad),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("check balance api error:", error);
    },
  });
};
