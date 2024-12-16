import api from "../apiClient";

export const getPricingList = async () => {
  const response = await api.get(
    `resource/Packages?fields=["status","package_name","amount","offer_amount","offer_amount_percentage","total_amount"]&filters=[["status","=","Active"]]`
  );
  return response;
};
