import { useQuery } from "@tanstack/react-query";

import { getJjikboulDetailApi, JjikboulResponse } from "@/domains/jjikboul/api/jjikboul";
import { Jjikboul } from "@/domains/jjikboul/types/jjikboul";
import { transformGym, transformLevel } from "@/domains/record/transforms/common";

export const transformJjikboul = (serverData: JjikboulResponse): Jjikboul => {
  return {
    jjikboulId: serverData.jjikboulId ?? 0,
    problemType: serverData.problemType ?? "",
    description: serverData.description ?? "",
    problemUrl: serverData.problemUrl,
  };
};

export const useJjikboulDetailQuery = (jjikboulId: string) => {
  return useQuery({
    queryKey: ["jjikboul", jjikboulId],
    queryFn: () => getJjikboulDetailApi(jjikboulId),
    enabled: !!jjikboulId,
    select: (data) => ({
      jjikboul: transformJjikboul(data.jjikboul),
      memberInfo: {
        memberId: data.memberInfo.memberId || 0,
        nickname: data.memberInfo.nickname || "",
        profileUrl: data.memberInfo.profileUrl || "",
      },
      gym: transformGym(data.gym),
      level: transformLevel(data.level),
      isEditable: data.isEditable ?? false,
      isDeletable: data.isDeletable ?? false,
    }),
  });
};
