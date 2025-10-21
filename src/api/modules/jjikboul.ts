import { api } from "@/api/axios";
import { MemberInfoResponse } from "@/api/modules/user";
import { GymResponse, LevelResponse } from "@/api/modules/record";

export interface JjikboulResponse {
  jjikboulId: number;
  problemType: string;
  description: string;
  problemUrl?: string;
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
  return res.data;
};
