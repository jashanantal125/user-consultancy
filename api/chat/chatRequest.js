import api from "../apiClient";

export const sendChatRequest = async (payLoad) => {
  const response = await api.post(
    `method/consultant.api.conversation.send_conversation_request`,
    { ...payLoad }
  );
  return response;
};
