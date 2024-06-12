import { api } from "@/api/axios";

// 기록 생성
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
