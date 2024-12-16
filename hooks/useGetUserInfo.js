import { useMutation } from "@tanstack/react-query";
import { userInfo } from "../api/user/userInfo";

export const useGetUserInfo = () => {
  return useMutation({
    mutationFn: (credentials) => userInfo(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Get user error:", error);
    },
  });
};
