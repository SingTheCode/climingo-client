import { useMutation } from "@tanstack/react-query";

import type { SignInRequest } from "@/domains/auth/types/entity";

import { authApi } from "@/domains/auth/api/authApi";

import useUserStore from "@/store/user";

export const useSignIn = () => {
  const setUser = useUserStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (params: SignInRequest) => authApi.signIn(params),
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
    signIn: mutation.mutateAsync,
    isSigningIn: mutation.isPending,
    error: mutation.error,
  };
};
