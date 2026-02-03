import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EditNicknameRequest } from "@/domains/profile/types/entity";

import { profileApi } from "@/domains/profile/api/profileApi";

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  const editNicknameMutation = useMutation({
    mutationFn: (params: EditNicknameRequest) =>
      profileApi.editNickname(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "my"] });
    },
  });

  return {
    editNickname: editNicknameMutation.mutateAsync,
    isEditing: editNicknameMutation.isPending,
    error: editNicknameMutation.error,
  };
};
