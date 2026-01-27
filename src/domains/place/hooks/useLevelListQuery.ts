import { useQuery } from "@tanstack/react-query";

import { placeApi } from "@/domains/place/api/placeApi";

export const useLevelListQuery = (gymId: number) => {
  return useQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => placeApi.getLevels(gymId),
    enabled: gymId > 0,
  });
};
