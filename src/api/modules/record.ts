import { MemberInfo } from "@/types/user";
import { Level, Gym, Record } from "@/types/record";
import { api } from "@/api/axios";
import { LEVELS } from "@/constants/level";

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

// 기록 목록 조회
export const getRecordListApi = async ({
  gymId,
  levelId,
  memberId,
  page,
  size,
}: {
  gymId?: number;
  levelId?: number;
  memberId?: number;
  page?: number;
  size?: number;
}) => {
  const params = new URLSearchParams({
    ...(gymId && { gymId: gymId.toString() }),
    ...(levelId && { levelId: levelId.toString() }),
    ...(memberId && { memberId: memberId.toString() }),
    ...(page && { page: page.toString() }),
    ...(size && { size: size.toString() }),
  });
  const res = await api.get<{
    contents: {
      memberInfo: MemberInfo;
      record: Record;
      gym: Gym;
      level: Level;
    }[];
    page: number;
    size: number;
    isEnd: boolean;
  }>(`/records?${params}`);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

// 암장별 난이도 조회
export const getLevelListApi = async ({ gymId }: { gymId: number }) => {
  const res = await api.get<Level[]>(`/gyms/${gymId}/levels`);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data.map((level) => ({
    ...level,
    colorCode:
      LEVELS.find((item) => item.colorNameEn === level.colorNameEn)
        ?.colorCode || "#ffffff",
  }));
};
