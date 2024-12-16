import { useMutation } from "@tanstack/react-query";
import { endChat } from "../api/chat/endChat";
import { chatDeduction } from "../api/chat/chatDeduction";

export const useChatDeduction = () => {
  return useMutation({
    mutationFn: (payLoad) => chatDeduction(payLoad),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("chat deduction error:", error);
    },
  });
};
