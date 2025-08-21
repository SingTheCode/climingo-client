import { useQuery } from "@tanstack/react-query";

import { getJjikboulDetailApi, JjikboulResponse } from "@/api/modules/jjikboul";
import { Jjikboul } from "@/types/jjikboul";
import { GymModel, LevelModel } from "@/api/hooks/record";

export const JjikboulModel = (serverData: JjikboulResponse): Jjikboul => {
  return {
    jjikboulId: serverData.jjikboulId ?? 0,
    problemType: serverData.problemType ?? "",
    description: serverData.description ?? "",
    problemUrl: serverData.problemUrl,
  };
};

export const useGetJjikboulDetailQuery = (jjikboulId: string) => {
  return useQuery({
    queryKey: ["jjikboul", jjikboulId],
    queryFn: () => getJjikboulDetailApi(jjikboulId),
    enabled: !!jjikboulId, // jjikbolId가 있을 때만 쿼리 실행
    select: (data) => ({
      jjikboul: JjikboulModel(data.jjikboul),
      memberInfo: {
        memberId: data.memberInfo.memberId || 0,
        nickname: data.memberInfo.nickname || "",
        profileUrl: data.memberInfo.profileUrl || "",
      },
      gym: GymModel(data.gym),
      level: LevelModel(data.level),
      isEditable: data.isEditable ?? false,
      isDeletable: data.isDeletable ?? false,
    }),
  });
};
