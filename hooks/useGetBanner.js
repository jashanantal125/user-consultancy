import { useMutation } from "@tanstack/react-query";
import { banners } from "../api/home/banners";

export const useGetBanner = () => {
  return useMutation({
    mutationFn: () => banners(),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("banners error:", error);
    },
  });
};
