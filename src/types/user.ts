export type OAuthProvider = "kakao" | "apple";

export interface UserInfo {
  nickname: string;
  profileImage: string;
  memberId?: string;
  authId?: string;
  email?: string;
  providerType?: OAuthProvider;
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

export interface UserState {
  isAuthorized: boolean;
  memberInfo: UserInfo;
}
