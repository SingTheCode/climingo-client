import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/domains/auth/api/authApi";
import type { OAuthRequest } from "@/domains/auth/types/entity";

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
