import { useMutation } from "@tanstack/react-query";
import { endChat } from "../api/chat/endChat";

export const useEndChat = () => {
  return useMutation({
    mutationFn: (payLoad) => endChat(payLoad),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get language error:", error);
    },
  });
};
