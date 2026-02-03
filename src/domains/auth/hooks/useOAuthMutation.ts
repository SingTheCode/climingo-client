import { useMutation } from "@tanstack/react-query";

import type { OAuthRequest } from "@/domains/auth/types/entity";

import { authApi } from "@/domains/auth/api/authApi";

export const useOAuth = () => {
  const mutation = useMutation({
    mutationFn: (params: OAuthRequest) => authApi.checkOAuth(params),
  });

  return {
    checkOAuth: mutation.mutateAsync,
    isChecking: mutation.isPending,
    error: mutation.error,
  };
};
