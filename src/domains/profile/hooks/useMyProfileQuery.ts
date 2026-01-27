import { useQuery } from "@tanstack/react-query";

import { profileApi } from "@/domains/profile/api/profileApi";

export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMyProfile(),
  });
};
