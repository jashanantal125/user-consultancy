import api from "../apiClient";

export const userInfo = async (email) => {
  const response = await api.get(`resource/User/${email}`);
  return response;
};
