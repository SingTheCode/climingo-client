import type { Place, Level } from "@/domains/place/types/entity";
import type {
  PlaceResponse,
  LevelResponse,
} from "@/domains/place/types/response";

import { api } from "@/api/fetchClient";

import {
  transformPlaceResponseToEntity,
  transformLevelResponseToEntity,
} from "./transform";

export const placeApi = {
  async searchClimbingPlace(keyword: string): Promise<Place[]> {
    const data = await api.get<PlaceResponse[]>("/search/gyms", {
      params: { keyword },
    });
    return data.map(transformPlaceResponseToEntity);
  },

  async getLevels(gymId: number): Promise<Level[]> {
    if (!gymId) {
      throw new Error("GymId가 유효하지 않아요.");
    }
    const data = await api.get<LevelResponse[]>(`/gyms/${gymId}/levels`);
    return data.map(transformLevelResponseToEntity);
  },
};
