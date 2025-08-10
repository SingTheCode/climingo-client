import { useQuery } from "@tanstack/react-query";

import { getJjikboulDetailApi, JjikboulResponse } from "@/api/modules/jjikboul";
import { Jjikboul } from "@/types/jjikboul";

export const JjikboulModel = (serverData: JjikboulResponse): Jjikboul => {
  return {
    id: serverData.jjikboulId ?? "",
    problemType: serverData.problemType ?? "",
    description: serverData.description ?? "",
    createdDate: serverData.createdDate ?? "",
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
        id: String(data.memberInfo.memberId || ""),
        nickname: data.memberInfo.nickname,
        profileUrl: data.memberInfo.profileUrl || "",
      },
      gym: {
        gymId: String(data.gym.gymId),
        gymName: data.gym.gyName,
      },
      level: {
        levelId: String(data.level.levelId),
        colorNameKo: data.level.colorNameKo,
        colorNameEn: data.level.colorNameEn,
      },
      isEditable: data.isEditable ?? false,
      isDeletable: data.isDeletable ?? false,
    }),
  });
};
