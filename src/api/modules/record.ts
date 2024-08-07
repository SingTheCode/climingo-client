import { MemberInfo } from "@/types/user";
import { Level, Gym, Record, RecordListApiResponse } from "@/types/record";
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

// presigned url 조회
export const getPresignedUrlApi = async (params: {
  fileName: string;
  extension: string;
}) => {
  const res = await api.post<{ presignedUrl: string; videoUrl: string }>(
    "/s3/presigned-url",
    params
  );

  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

// s3 업로드
export const uploadVideoApi = async ({
  presignedUrl,
  file,
}: {
  presignedUrl: string;
  file: File;
}) => {
  const res = await api.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });

  if (res.status !== 200) {
    throw new Error();
  }
};

// 기록 생성
export const createRecordApi = async (data: {
  gymId: number;
  levelId: number;
  videoUrl: string;
}) => {
  const res = await api.post<{ recordId: number }>("/records", data);

  return res.data;
};

// 기록 삭제
export const deleteRecordApi = async (id: string) => {
  const res = await api.delete<{ recordId: number }>(`/records/${id}`);
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
  const res = await api.get<RecordListApiResponse>(`/records?${params}`);
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
