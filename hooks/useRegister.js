import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth/register";

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials) => register(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("register error:", error);
    },
  });
};
