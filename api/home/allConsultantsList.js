import api from "../apiClient";

export const allConsultantList = async (payLoad) => {
  const { type } = payLoad;
  const { category } = payLoad;
  const response = await api.get(
    `resource/User?fields=["first_name","user_image","experience","email","user_typee","actual_rating","category","primary_skills","chat_price","call_price","active_status","language","minimum_min_chat","end_alert_time","recharge_alert_time"]&filters=[["user_typee","=","CONSULTANT"],["category","=","${category}"],["service_available","=","${type}"]]&order_by=performence desc`
  );
  return response;
};
