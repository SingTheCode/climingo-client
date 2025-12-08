import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editNicknameApi } from "@/domains/auth/api/user";

const useEditNicknameQuery = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: string) => editNicknameApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export default useEditNicknameQuery;
