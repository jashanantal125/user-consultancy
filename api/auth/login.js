import api from "../apiClient";

export const login = async (credentials) => {
  const response = await api.post(
    "method/consultant.api.auth.login",
    credentials
  );
  return response;
};
