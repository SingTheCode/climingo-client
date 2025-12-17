import type { User, OAuthResult } from "@/domains/auth/types/entity";
import type {
  MemberInfoResponse,
  OAuthResponse,
  SignInResponse,
  SignUpResponse,
} from "@/domains/auth/types/response";

export const transformMemberInfoToUser = (
  response: MemberInfoResponse
): User => ({
  memberId: response.memberId,
  nickname: response.nickname ?? "익명",
  profileUrl: response.profileUrl ?? "",
  email: response.email ?? "",
  authId: response.authId ?? "",
  providerType: response.providerType ?? "kakao",
});

export const transformOAuthResponseToEntity = (
  response: OAuthResponse
): OAuthResult => ({
  registered: response.registered,
  user: transformMemberInfoToUser(response.memberInfo),
  providerToken: response.memberInfo.providerToken,
});

export const transformSignInResponseToUser = (
  response: SignInResponse
): User => ({
  memberId: response.memberId ?? 0,
  nickname: response.nickname ?? "익명",
  profileUrl: response.profileUrl ?? "",
  email: response.email ?? "",
  authId: response.authId ?? "",
  providerType: response.providerType ?? "kakao",
});

export const transformSignUpResponseToUser = (
  response: SignUpResponse
): User => ({
  memberId: response.memberId ?? 0,
  nickname: response.nickname ?? "익명",
  profileUrl: response.profileUrl ?? "",
  email: response.email ?? "",
  authId: response.authId ?? "",
  providerType: response.providerType ?? "kakao",
});
