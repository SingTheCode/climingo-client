import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecordApi } from "@/api/modules/record";

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
