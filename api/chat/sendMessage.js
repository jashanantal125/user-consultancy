import api from "../apiClient";

export const sendMessage = async (payLoad) => {
  const response = await api.post(`method/chat.api.message.send`, {
    ...payLoad,
  });
  return response;
};
