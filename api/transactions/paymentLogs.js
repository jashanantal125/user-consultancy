import api from "../apiClient";

export const paymentLogs = async (email) => {
  const response = await api.get(
    `resource/User Transactions?fields=["name","transaction_id","user","transaction_type","amount","tax_amount","transaction_date","cashback"]&filters=[["user","=","${email}"],["transaction_type","=","CREDIT"]]&order_by=transaction_date desc`
  );
  return response;
};
