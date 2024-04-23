export type OAuthProvider = "kakao" | "apple";

interface UserInfo {
  authId: string;
  email?: string;
  nickname: string;
  providerType: OAuthProvider;
}

export interface OAuthApiRequest {
  providerType: "kakao" | "apple";
  redirectUri: string;
  code: string;
}

export interface OAuthApiResponse {
  // 회원가입 여부
  registered: boolean;
  memberInfo: UserInfo & { providerToken: string };
}

export interface AuthorizingResponse {
  isAuthorized: boolean;
  memberInfo: UserInfo;
}
