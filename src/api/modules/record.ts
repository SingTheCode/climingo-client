import { MemberInfo } from "@/types/user";
import { Level, Gym, Record } from "@/types/record";
import { api } from "@/api/axios";

// 기록 상세 조회
export const getRecordDetailApi = async ({
  recordId,
}: {
  recordId: string;
}) => {
  const res = await api.get<{
    memberInfo: MemberInfo;
    record: Record;
    gym: Gym;
    level: Level;
  }>(`/records/${recordId}`);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

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
