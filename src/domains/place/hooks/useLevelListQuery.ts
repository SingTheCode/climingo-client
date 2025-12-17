import { useSuspenseQuery } from "@tanstack/react-query";
import { placeApi } from "@/domains/place/api/placeApi";

export const useLevelListQuery = (gymId: number) => {
  return useSuspenseQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => placeApi.getLevels(gymId),
  });
};
