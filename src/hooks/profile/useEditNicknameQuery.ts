import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editNicknameApi } from "@/api/modules/user";

const useEditNicknameQuery = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: string) => editNicknameApi(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export default useEditNicknameQuery;
