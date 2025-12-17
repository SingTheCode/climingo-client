import { useSuspenseQuery } from "@tanstack/react-query";
import { profileApi } from "@/domains/profile/api/profileApi";

export const useMyProfileQuery = () => {
  return useSuspenseQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMyProfile(),
  });
};
