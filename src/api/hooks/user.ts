import { useQuery } from "@tanstack/react-query";

import { OAuthApiRequest, OAuthProvider } from "@/types/auth";
import { oAuthApi, signInApi } from "@/api/modules/user";

// 회원가입 여부 조회
export const useUserQuery = (params: OAuthApiRequest) =>
  useQuery({
    queryKey: ["oAuth"],
    queryFn: () => oAuthApi(params),
  });

// 로그인
export const useSignInQuery = (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) =>
  useQuery({
    queryKey: ["user"],
    queryFn: () =>
      signInApi({
        providerType: params.providerType,
        providerToken: params.providerToken,
      }),
  });
