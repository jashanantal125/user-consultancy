import { useMutation } from "@tanstack/react-query";
import { consultantRatings } from "../api/ratings/consultantRatings";

export const useGetConsultantRatings = () => {
  return useMutation({
    mutationFn: (email) => consultantRatings(email),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("faq logs:", error);
    },
  });
};
