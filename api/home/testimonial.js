import api from "../apiClient";

export const testimonial = async () => {
  const response = await api.get(
    `resource/Testimonials?fields=["status","testimonial_name","image","description"]&filters=[["status","=","Active"]]`
  );
  return response;
};
