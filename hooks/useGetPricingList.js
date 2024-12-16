import { useMutation } from "@tanstack/react-query";

import { getPricingList } from "../api/wallet/getPricingList";

export const useGetPricingList = () => {
  return useMutation({
    mutationFn: () => getPricingList(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Get pricing list error:", error);
    },
  });
};
