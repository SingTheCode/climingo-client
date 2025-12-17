import { useSuspenseQuery } from "@tanstack/react-query";
import { jjikboulApi } from "@/domains/jjikboul/api/jjikboulApi";

export const useJjikboulDetailQuery = (jjikboulId: string) => {
  return useSuspenseQuery({
    queryKey: ["jjikboul", jjikboulId],
    queryFn: () => jjikboulApi.getJjikboulDetail(jjikboulId),
  });
};
