import { useQuery } from "@tanstack/react-query";
import { jjikboulApi } from "@/domains/jjikboul/api/jjikboulApi";

export const useGetJjikboulDetailQuery = (jjikboulId: string) => {
  return useQuery({
    queryKey: ["jjikboul", jjikboulId],
    queryFn: () => jjikboulApi.getJjikboulDetail(jjikboulId),
    enabled: !!jjikboulId,
  });
};
