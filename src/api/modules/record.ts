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
