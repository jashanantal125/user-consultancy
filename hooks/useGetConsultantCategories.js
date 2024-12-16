import { useMutation } from "@tanstack/react-query";
import { consultantCategories } from "../api/home/consultantCategories";

export const useGetConsultantCategories = () => {
  return useMutation({
    mutationFn: () => consultantCategories(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("consultant categories error:", error);
    },
  });
};
