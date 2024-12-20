import api from "../apiClient";

export const faq = async () => {
  const response = await api.get(
    `resource/FAQs?fields=["name","question","answer"]`
  );
  return response;
};
