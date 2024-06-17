import { useMutation } from "@tanstack/react-query";

import { createRecordApi } from "@/api/modules/record";

const useCreateRecordMutation = () => {
  return useMutation({
    mutationFn: createRecordApi,
  });
};

export default useCreateRecordMutation;
