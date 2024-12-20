import { useMutation } from "@tanstack/react-query";
import { getLanguage } from "../api/auth/register";
import { aboutUs } from "../api/about/aboutUs";

export const useAboutUs = () => {
  return useMutation({
    mutationFn: () => aboutUs(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("about us error:", error);
    },
  });
};
