export type OAuthProvider = 'kakao' | 'apple';

export interface User {
  memberId: number;
  nickname: string;
  profileUrl: string;
  email: string;
  authId: string;
  providerType: OAuthProvider;
}

export interface OAuthResult {
  registered: boolean;
  user: User;
  providerToken: string;
}

export interface SignInRequest {
  providerType: OAuthProvider;
  providerToken: string;
}

export interface SignUpRequest {
  nickname: string;
  profileUrl: string;
  authId: string;
  email: string;
  providerType: OAuthProvider;
  providerToken: string;
}

export interface OAuthRequest {
  providerType: OAuthProvider;
  redirectUri: string;
  code: string;
}
