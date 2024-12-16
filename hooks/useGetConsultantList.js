import { useMutation } from "@tanstack/react-query";

import { consultantList } from "../api/home/consultantList";

export const useGetConsultantList = () => {
  return useMutation({
    mutationFn: (category) => consultantList(category),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get language error:", error);
    },
  });
};
