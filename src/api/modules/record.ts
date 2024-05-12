import { api } from "@/api/axios";
import { UserInfo } from "@/types/user";
import { Grade, Gym, Record } from "@/types/record";

// 기록 상세 조회
export const getRecordDetailApi = async ({
  recordId,
}: {
  recordId: string;
}) => {
  const res = await api.get<{
    memberInfo: UserInfo;
    record: Record;
    gym: Gym;
    grade: Grade;
  }>(`/records`, {
    params: {
      recordId,
    },
  });
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
