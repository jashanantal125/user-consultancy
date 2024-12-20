import api from "../apiClient";

export const consultantRatings = async (email) => {
  const response = await api.get(
    `method/consultant.api.consultant.get_consultant_ratings?email=${email}`
  );
  return response;
};
