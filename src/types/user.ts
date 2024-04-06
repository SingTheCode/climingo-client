import { OAuthProvider } from "@/types/common";

export interface UserInfo {
  nickname: string;
  image: string;
  gender?: string;
  age?: number;
}

export interface OAuthApiResponse {
  // 회원가입 여부
  isAlreadySignUp: boolean;
  // 회원가입에 사용할 사용자 정보
  userInfo: UserInfo;
  provider: OAuthProvider;
  oAuthToken: string;
}

export interface UserApiResponse {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
}
