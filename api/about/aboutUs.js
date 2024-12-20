import api from "../apiClient";

export const aboutUs = async () => {
  const response = await api.get(
    `resource/About Us?fields=["name","email","mobile_no","content"]&limit_page_length=1`
  );
  return response;
};
