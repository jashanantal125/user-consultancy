import api from "../apiClient";

export const register = async (credentials) => {
  const response = await api.post(
    "method/consultant.api.user.register",
    credentials
  );
  return response;
};

export const uploadFile = async (payLoad) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };
  const response = await api.post("method/upload_file", payLoad, config);
  return response;
};

export const getLanguage = async () => {
  const response = await api.get("method/consultant.api.user.get_languages");
  return response;
};
