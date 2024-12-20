import api from "../apiClient";

export const helpAndSupport = async (payLoad) => {
  const response = await api.post(`resource/Tickets`, { ...payLoad });
  return response;
};
