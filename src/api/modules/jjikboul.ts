import { api } from "@/api/axios";
import { MemberInfoResponse } from "@/api/modules/user";
import { GymResponse, LevelResponse } from "@/api/modules/record";

export interface JjikboulResponse {
  jjikboulId: string;
  problemType: string;
  description: string;
  createdDate: string;
}

export const getJjikboulDetailApi = async (id: string) => {
  const res = await api.get<{
    jjikboul: JjikboulResponse;
    memberInfo: MemberInfoResponse;
    gym: GymResponse;
    level: LevelResponse;
    isEditable: boolean;
    isDeletable: boolean;
  }>(`/jjikbouls/${id}`);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
