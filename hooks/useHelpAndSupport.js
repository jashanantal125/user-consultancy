import { useMutation } from "@tanstack/react-query";

import { helpAndSupport } from "../api/helpandsupport/helpandsupport";

export const useHelpAndSupport = () => {
  return useMutation({
    mutationFn: (payload) => helpAndSupport(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("help and support error:", error);
    },
  });
};
