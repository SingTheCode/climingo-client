import { useSuspenseQuery } from "@tanstack/react-query";

import { recordApi } from "@/domains/record/api/recordApi";

export const useRecordDetail = (recordId: number) => {
  const { data: record } = useSuspenseQuery({
    queryKey: ["record", recordId],
    queryFn: () => recordApi.getRecordDetail(String(recordId)),
  });

  return {
    record,
  };
};
