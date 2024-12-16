import { useMutation } from "@tanstack/react-query";
import { getLanguage } from "../api/auth/register";

export const useGetLanguage = () => {
  return useMutation({
    mutationFn: () => getLanguage(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get language error:", error);
    },
  });
};
