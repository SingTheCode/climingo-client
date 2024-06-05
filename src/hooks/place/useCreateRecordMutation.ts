import { useMutation } from "@tanstack/react-query";
import { postRecordApi } from "@/api/modules/common";

const useCreateRecordMutation = () => {
  return useMutation({
    mutationFn: postRecordApi,
  });
};

export default useCreateRecordMutation;
