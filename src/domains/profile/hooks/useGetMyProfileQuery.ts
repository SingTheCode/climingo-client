import { useQuery } from "@tanstack/react-query";

import { getMyProfileApi } from "@/domains/auth/api/user";

const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => getMyProfileApi(),
  });
};

export default useGetMyProfileQuery;
