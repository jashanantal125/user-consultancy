import api from "../apiClient";

export const walletInfo = async (email) => {
  const response = await api.get(`resource/User Wallet/${email}`);
  return response;
};
