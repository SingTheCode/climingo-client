import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "@/domains/profile/api/profileApi";

export const useEditNicknameMutation = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) =>
      profileApi.editNickname({ memberId, nickname }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};
