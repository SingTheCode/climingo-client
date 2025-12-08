import { useQuery } from "@tanstack/react-query";

import { getLevelsApi } from "@/domains/place/api/common";

const useGetLevelsQuery = (gymId?: number) => {
  return useQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => getLevelsApi(gymId),
    enabled: !!gymId,
  });
};

export default useGetLevelsQuery;
