import { api } from "@/api/axios";
import { MemberInfo } from "@/types/user";
import { Level, Gym, Record } from "@/types/record";

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

// 기록 상세 조회
export const getRecordListApi = async ({
  gymId,
  levelId,
  memberId,
  page,
  size,
}: {
  gymId?: string;
  levelId?: string;
  memberId?: string;
  page?: number;
  size?: number;
}) => {
  const params = new URLSearchParams({
    ...(gymId && { gymId }),
    ...(levelId && { levelId }),
    ...(memberId && { memberId }),
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
  }>(`/records?${params}`, {});
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
