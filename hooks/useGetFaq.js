import { useMutation } from "@tanstack/react-query";
import { faq } from "../api/about/faq";

export const useGetFaq = () => {
  return useMutation({
    mutationFn: () => faq(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("faq logs:", error);
    },
  });
};
