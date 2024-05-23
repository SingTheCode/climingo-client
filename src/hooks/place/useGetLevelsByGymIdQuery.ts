import { useQuery } from "@tanstack/react-query";
import { getLevelsByGymIdApi } from "@/api/modules/common";

const useGetLevelsByGymIdQuery = (gymId?: number) => {
  return useQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => getLevelsByGymIdApi(gymId),
    enabled: !!gymId,
  });
};

export default useGetLevelsByGymIdQuery;
