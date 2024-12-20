import api from "../apiClient";

export const walletTransactions = async (email) => {
  const response = await api.get(
    `method/consultant.api.consultant.get_user_transactions?email=${email}`
  );
  return response;
};
