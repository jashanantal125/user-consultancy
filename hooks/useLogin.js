import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth/login";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
