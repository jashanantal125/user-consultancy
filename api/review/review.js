import api from "../apiClient";

export const submitReview = async (payLoad) => {
  const response = await api.post(`resource/Consultant Rating`, {
    ...payLoad,
  });
  return response;
};
