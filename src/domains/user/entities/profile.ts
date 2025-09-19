import { OAuthProvider } from "./auth";

export interface MemberInfo {
  nickname: string;
  profileUrl: string;
  memberId?: number;
  authId?: string;
  email?: string;
  providerType?: OAuthProvider;
}
