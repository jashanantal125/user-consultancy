import { useMutation } from "@tanstack/react-query";
import { sendChatRequest } from "../api/chat/chatRequest";

export const useSendChatRequest = () => {
  return useMutation({
    mutationFn: (credentials) => sendChatRequest(credentials),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("register error:", error);
    },
  });
};
