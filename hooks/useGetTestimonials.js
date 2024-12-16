import { useMutation } from "@tanstack/react-query";
import { testimonial } from "../api/home/testimonial";

export const useGetTestimonials = () => {
  return useMutation({
    mutationFn: () => testimonial(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Get testimonials error:", error);
    },
  });
};
