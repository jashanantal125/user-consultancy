import api from "../apiClient";

export const getChatHistory = async (payload) => {
  const { room } = payload;
  const { email } = payload;
  const response = await api.get(
    `method/chat.api.message.get_chat_history?room=${room}&email=${email}`
  );
  return response;
};
