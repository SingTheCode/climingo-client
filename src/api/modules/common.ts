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
