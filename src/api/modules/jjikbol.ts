import { api } from "@/api/axios";
import { MemberInfoResponse } from "@/api/modules/user";
import { GymResponse, LevelResponse } from "@/api/modules/record";

export interface JjikbolResponse {
  jjikbolId: string;
  problemType: string;
  description: string;
  createdDate: string;
}

export const getJjikbolDetailApi = async (id: string) => {
  const res = await api.get<{
    jjikbol: JjikbolResponse;
    memberInfo: MemberInfoResponse;
    gym: GymResponse;
    level: LevelResponse;
    isEditable: boolean;
    isDeletable: boolean;
  }>(`/jjikbol/${id}`);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
