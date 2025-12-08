import { useQuery } from "@tanstack/react-query";

import { getRecordDetailApi } from "@/domains/record/api/record";

export const useRecordDetailQuery = ({ recordId }: { recordId: string }) =>
  useQuery({
    queryKey: ["records", "detail", recordId],
    queryFn: () => getRecordDetailApi({ recordId }),
  });
