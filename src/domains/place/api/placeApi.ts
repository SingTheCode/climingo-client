import { api } from "@/api/axios";
import type {
  PlaceResponse,
  LevelResponse,
} from "@/domains/place/types/response";
import type { Place, Level } from "@/domains/place/types/entity";
import {
  transformPlaceResponseToEntity,
  transformLevelResponseToEntity,
} from "./transform";

export const placeApi = {
  async searchClimbingPlace(keyword: string): Promise<Place[]> {
    const response = await api.get<PlaceResponse[]>("/search/gyms", {
      params: { keyword },
    });
    return response.data.map(transformPlaceResponseToEntity);
  },

  async getLevels(gymId: number): Promise<Level[]> {
    if (!gymId) {
      throw new Error("GymId가 유효하지 않아요.");
    }
    const response = await api.get<LevelResponse[]>(`/gyms/${gymId}/levels`);
    return response.data.map(transformLevelResponseToEntity);
  },
};
