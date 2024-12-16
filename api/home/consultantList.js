import api from "../apiClient";

export const consultantList = async (category) => {
  const response = await api.get(
    `resource/User?fields=["first_name","user_image","experience","email","user_typee","actual_rating","category","primary_skills","chat_price","call_price","active_status","language","minimum_min_chat","minimum_min_call","end_alert_time","recharge_alert_time"]&filters=[["user_typee","=","CONSULTANT"],["category","=","${category}"]]&order_by=performence desc&limit_page_length=10`
  );
  return response;
};
