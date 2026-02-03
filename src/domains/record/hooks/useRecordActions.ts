import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { recordApi } from "@/domains/record/api/recordApi";

export const useRecordActions = () => {
  const queryClient = useQueryClient();

  // 신고 사유 목록 조회
  const { data: reportReasons } = useSuspenseQuery({
    queryKey: ["reportReasons"],
    queryFn: recordApi.getReportReasons,
  });

  // 기록 삭제
  const deleteMutation = useMutation({
    mutationFn: recordApi.deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });

  // 기록 신고
  const reportMutation = useMutation({
    mutationFn: ({
      recordId,
      reasonCode,
    }: {
      recordId: string;
      reasonCode: string;
    }) => recordApi.reportRecord(recordId, { reasonCode }),
  });

  const deleteRecord = (recordId: string) => {
    deleteMutation.mutate(recordId);
  };

  const reportRecord = (recordId: string, reasonCode: string) => {
    reportMutation.mutate({ recordId, reasonCode });
  };

  return {
    reportReasons,
    deleteRecord,
    reportRecord,
    isDeleting: deleteMutation.isPending,
    isReporting: reportMutation.isPending,
    deleteError: deleteMutation.error,
    reportError: reportMutation.error,
    isReportSuccess: reportMutation.isSuccess,
  };
};
