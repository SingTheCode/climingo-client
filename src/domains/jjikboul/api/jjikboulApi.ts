import type { JjikboulDetail } from "@/domains/jjikboul/types/entity";
import type { JjikboulDetailResponse } from "@/domains/jjikboul/types/response";

import { api } from "@/api/axios";

import { transformJjikboulDetailResponseToEntity } from "./transform";

export const jjikboulApi = {
  async getJjikboulDetail(id: string): Promise<JjikboulDetail> {
    const response = await api.get<JjikboulDetailResponse>(`/jjikbouls/${id}`);
    return transformJjikboulDetailResponseToEntity(response.data);
  },
};
