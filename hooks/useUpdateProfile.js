import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/user/updateProfile";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload) => updateProfile(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("update profile:", error);
    },
  });
};
