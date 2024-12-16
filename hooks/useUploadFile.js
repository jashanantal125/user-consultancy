import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api/auth/register";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (credentials) => uploadFile(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("upload file error:", error);
    },
  });
};
