import { useMutation } from "@tanstack/react-query";
import { getFareBreakup } from "../api/wallet/getFareBreakup";

export const useFareBreakup = () => {
  return useMutation({
    mutationFn: (payLoad) => getFareBreakup(payLoad),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("fare breakup api error:", error);
    },
  });
};
