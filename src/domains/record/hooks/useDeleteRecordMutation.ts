import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecordApi } from "@/domains/record/api/record";

const useDeleteRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecordApi,
    onSuccess: ({ recordId }) => {
      queryClient.invalidateQueries({ queryKey: ["records", recordId] });
    },
  });
};

export default useDeleteRecordMutation;
