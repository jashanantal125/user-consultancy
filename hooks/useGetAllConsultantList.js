import { useMutation } from "@tanstack/react-query";
import { allConsultantList } from "../api/home/allConsultantsList";

export const useGetAllConsultantList = () => {
  return useMutation({
    mutationFn: (payLoad) => allConsultantList(payLoad),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("get language error:", error);
    },
  });
};
