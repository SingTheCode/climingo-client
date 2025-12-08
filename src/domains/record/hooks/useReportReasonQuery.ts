import { useQuery } from "@tanstack/react-query";

import { getReportReasonApi } from "@/domains/record/api/record";

const useReportReasonQuery = () => {
  return useQuery({
    queryKey: ["report", "reason"],
    queryFn: getReportReasonApi,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 60, // 1시간
  });
};

export default useReportReasonQuery;
