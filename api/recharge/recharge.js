import api from "../apiClient";

export const rechargeApi = async (payLoad) => {
  const response = await api.post(
    `method/consultant.api.consultant.recharge_now`,
    { ...payLoad }
  );
  return response;
};
