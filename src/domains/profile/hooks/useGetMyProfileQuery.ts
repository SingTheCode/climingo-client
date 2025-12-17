import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/domains/profile/api/profileApi";

export const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMyProfile(),
  });
};
