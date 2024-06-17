import { Level } from "@/types/record";
import { api } from "@/api/axios";

// 암장 검색
export const searchClimbingPlaceApi = async (keyword: string) => {
  const res = await api.get(`/search/gyms`, {
    params: { keyword },
  });
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

// 암장 난이도 조회
// TODO: 난이도 조회 api 통합
export const getLevelsApi = async (gymId?: number) => {
  if (!gymId) {
    throw new Error("GymId가 유효하지 않아요.");
  }

  const res = await api.get<Level[]>(`/gyms/${gymId}/levels`);
  return res.data;
};
