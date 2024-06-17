import { useQuery } from "@tanstack/react-query";
import { getRecordDetailApi } from "@/api/modules/record";

// 기록 상세 조회
export const useGetRecordDetailQuery = ({ recordId }: { recordId: string }) =>
  useQuery({
    queryKey: ["recordDetail"],
    queryFn: () => getRecordDetailApi({ recordId }),
  });
