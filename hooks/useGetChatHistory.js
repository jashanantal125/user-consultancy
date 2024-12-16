import { useMutation } from "@tanstack/react-query";
import { getChatHistory, getChatHistoryList } from "../api/chat/chatHistory";

export const useGetChatHistory = () => {
  return useMutation({
    mutationFn: (payload) => getChatHistory(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get chat history error:", error);
    },
  });
};
