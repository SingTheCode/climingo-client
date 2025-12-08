import { api } from "@/api/axios";
import { MemberInfoResponse } from "@/domains/auth/api/user";
import { GymResponse, LevelResponse } from "@/domains/record/api/record";

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

export const createJjikboulApi = async (data: FormData) => {
  const res = await api.post("/jjikbouls", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
