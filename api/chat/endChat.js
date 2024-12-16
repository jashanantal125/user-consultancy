import api from "../apiClient";

export const endChat = async (payload) => {
  const response = await api.post(
    `method/chat.api.message.update_session_status_in_chat_room`,
    { ...payload }
  );
  return response;
};
