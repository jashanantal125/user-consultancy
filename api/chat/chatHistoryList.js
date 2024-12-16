import api from "../apiClient";

export const getChatHistoryList = async (email) => {
  const response = await api.get(
    `method/chat.api.message.get_chat_room_list?email=${email}`
  );
  return response;
};
