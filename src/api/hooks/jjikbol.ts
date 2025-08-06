import { useQuery } from "@tanstack/react-query";

import { getJjikbolDetailApi, JjikbolResponse } from "@/api/modules/jjikbol";
import { Jjikbol } from "@/types/jjikbol";
import { MemberInfoModel } from "@/api/hooks/user";
import { GymModel, LevelModel } from "@/api/hooks/record";

export const JjikbolModel = (serverData: JjikbolResponse): Jjikbol => {
  return {
    id: serverData.jjikbolId ?? "",
    problemType: serverData.problemType ?? "",
    description: serverData.description ?? "",
    createdDate: serverData.createdDate ?? "",
  };
};

export const useGetJjikbolDetailQuery = (jjikbolId: string) => {
  return useQuery({
    queryKey: ["jjikbol", jjikbolId],
    queryFn: () => getJjikbolDetailApi(jjikbolId),
    select: (data) => ({
      jjikbol: JjikbolModel(data.jjikbol),
      memberInfo: MemberInfoModel(data.memberInfo),
      gym: GymModel(data.gym),
      level: LevelModel(data.level),
      isEditable: data.isEditable ?? false,
      isDeletable: data.isDeletable ?? false,
    }),
  });
};
