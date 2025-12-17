import type { OAuthProvider } from "./entity";

export interface MemberInfoResponse {
  authId?: string;
  email?: string;
  memberId: number;
  nickname: string;
  profileUrl: string;
  providerType?: OAuthProvider;
}

export interface OAuthResponse {
  registered: boolean;
  memberInfo: MemberInfoResponse & { providerToken: string };
}

export interface SignInResponse {
  authId?: string;
  email?: string;
  memberId?: number;
  nickname: string;
  profileUrl: string;
  providerType?: OAuthProvider;
}

export interface SignUpResponse {
  authId?: string;
  email?: string;
  memberId?: number;
  nickname: string;
  profileUrl: string;
  providerType?: OAuthProvider;
}
