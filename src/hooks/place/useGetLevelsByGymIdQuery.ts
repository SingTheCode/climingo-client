import { useQuery } from "@tanstack/react-query";
import { getLevelsByGymId } from "@/api/modules/common";

const useGetLevelsByGymIdQuery = (gymId?: number) => {
  return useQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => getLevelsByGymId(gymId),
    enabled: !!gymId,
  });
};

export default useGetLevelsByGymIdQuery;
