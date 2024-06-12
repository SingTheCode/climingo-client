import { useQuery } from "@tanstack/react-query";
import { getLevelsId } from "@/api/modules/common";

const useGetLevelsQuery = (gymId?: number) => {
  return useQuery({
    queryKey: ["gym", gymId, "levels"],
    queryFn: () => getLevelsId(gymId),
    enabled: !!gymId,
  });
};

export default useGetLevelsQuery;
