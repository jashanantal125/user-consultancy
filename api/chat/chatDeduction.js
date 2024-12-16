import api from "../apiClient";

export const chatDeduction = async (payLoad) => {
  const response = await api.post(
    `method/consultant.api.consultant.update_balances`,
    { ...payLoad }
  );
  return response;
};
