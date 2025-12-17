import { useSuspenseQuery } from "@tanstack/react-query";
import { jjikboulApi } from "@/domains/jjikboul/api/jjikboulApi";

export const useJjikboulDetail = (id: string) => {
  const { data: jjikboulDetail } = useSuspenseQuery({
    queryKey: ["jjikboul", id],
    queryFn: () => jjikboulApi.getJjikboulDetail(id),
  });

  return {
    jjikboulDetail,
  };
};
