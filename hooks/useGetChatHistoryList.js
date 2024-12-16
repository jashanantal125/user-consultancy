import { useMutation } from "@tanstack/react-query";
import { getChatHistoryList } from "../api/chat/chatHistoryList";

export const useGetChatHistoryList = () => {
  return useMutation({
    mutationFn: (email) => getChatHistoryList(email),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get chat history error:", error);
    },
  });
};
