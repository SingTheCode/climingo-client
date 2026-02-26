"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EditProfileRequest } from "@/domains/profile/types/request";

import { profileApi } from "@/domains/profile/api/profileApi";

export const useEditProfileDetailMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: EditProfileRequest) => profileApi.editProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    editProfile: mutation.mutate,
    isEditing: mutation.isPending,
  };
};
