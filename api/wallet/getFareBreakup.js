import api from "../apiClient";

export const getFareBreakup = async (payload) => {
  const { amount } = payload;
  const { offer } = payload;
  const { offerPercent } = payload;
  const response = await api.get(
    `method/consultant.api.consultant.fare_breakdown?amount=${amount}&offer_amount=${offer}&offer_percent=${offerPercent}`
  );
  return response;
};
