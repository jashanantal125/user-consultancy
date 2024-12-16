import { useMutation } from "@tanstack/react-query";
import { submitReview } from "../api/review/review";

export const useSubmitReview = () => {
  return useMutation({
    mutationFn: (payload) => submitReview(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("submit review api error:", error);
    },
  });
};
