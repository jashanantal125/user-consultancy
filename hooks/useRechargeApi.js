import { useMutation } from "@tanstack/react-query";
import { rechargeApi } from "../api/recharge/recharge";

export const useRechargeApi = () => {
  return useMutation({
    mutationFn: (payload) => rechargeApi(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("recharge api fails:", error);
    },
  });
};
