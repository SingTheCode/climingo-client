import { useQuery } from "@tanstack/react-query";

import { OAuthApiRequest, OAuthProvider, MemberInfo } from "@/domains/auth/types/auth";
import { oAuthApi, signInApi, MemberInfoResponse } from "@/domains/auth/api/user";

export const MemberInfoModel = (serverData: MemberInfoResponse): MemberInfo => {
  return {
    nickname: serverData.nickname,
    profileUrl: serverData.profileUrl,
    memberId: serverData.memberId,
    authId: serverData.authId ?? "",
    email: serverData.email ?? "",
    providerType: serverData.providerType ?? "kakao",
  };
};

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
