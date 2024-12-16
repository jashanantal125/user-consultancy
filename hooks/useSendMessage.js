import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../api/chat/sendMessage";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (credentials) => sendMessage(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("register error:", error);
    },
  });
};
