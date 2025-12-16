import { api } from "@/api/axios";
import { MemberInfoResponse } from "@/domains/auth/types/response";
import type { GymResponse, LevelResponse } from "@/domains/record/types/response";

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
