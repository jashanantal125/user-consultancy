import api from "../apiClient";

export const banners = async () => {
  const response = await api.get(
    `resource/Banners?filters=[["banner_status","=","Active"]]&fields=["title","priority","image","banner_status"]`
  );
  return response;
};
