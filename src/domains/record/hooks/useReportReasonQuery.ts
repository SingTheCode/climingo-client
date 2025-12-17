import { useQuery } from "@tanstack/react-query";
import { recordApi } from "@/domains/record/api/recordApi";

export const useReportReasonQuery = () => {
  return useQuery({
    queryKey: ["report", "reason"],
    queryFn: recordApi.getReportReasons,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 60, // 1시간
  });
};
