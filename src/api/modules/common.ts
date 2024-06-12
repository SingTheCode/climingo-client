import { Level } from "@/types/common";
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

// TODO: 난이도 목록 api 통합
export const getLevelsId = async (gymId?: number) => {
  if (!gymId) {
    throw new Error("GymId가 유효하지 않아요.");
  }

  const res = await api.get<Level[]>(`/gyms/${gymId}/levels`);
  return res.data;
};

export const createRecordApi = async (data: {
  gymId: number;
  levelId: number;
  video: File;
}) => {
  const res = await api.post<{ recordId: number }>("/records", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
