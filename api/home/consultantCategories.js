import api from "../apiClient";

export const consultantCategories = async () => {
  const response = await api.get(
    `resource/Category?fields=["status","name","image","minimum_min_chat","minimum_min_call"]&filters=[["status","=","Active"]]`
  );
  return response;
};
