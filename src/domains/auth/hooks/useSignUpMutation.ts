import { useMutation } from "@tanstack/react-query";

import type { SignUpRequest } from "@/domains/auth/types/entity";

import { authApi } from "@/domains/auth/api/authApi";

import useUserStore from "@/store/user";

export const useSignUp = () => {
  const setUser = useUserStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (params: SignUpRequest) => authApi.signUp(params),
    onSuccess: (user) => {
      setUser({
        memberId: user.memberId,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        email: user.email,
        authId: user.authId,
        providerType: user.providerType,
      });
    },
  });

  return {
    signUp: mutation.mutateAsync,
    isSigningUp: mutation.isPending,
    error: mutation.error,
  };
};
