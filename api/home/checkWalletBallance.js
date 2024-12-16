import api from "../apiClient";

export const checkWalletBalance = async (payLoad) => {
  const { email } = payLoad;
  const { price } = payLoad;
  const { minutes } = payLoad;
  const response = await api.get(
    `method/consultant.api.consultant.check_wallet_balance?email=${email}&service_price=${price}&service_minute=${minutes}`
  );
  return response;
};
