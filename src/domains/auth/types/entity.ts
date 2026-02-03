export type OAuthProvider = "kakao" | "apple";

export interface User {
  memberId: number;
  nickname: string;
  profileUrl: string;
  email: string;
  authId: string;
  providerType: OAuthProvider;
}

// types/auth.ts에서 이동
export interface MemberInfo {
  nickname: string;
  profileUrl: string;
  memberId?: number;
  authId?: string;
  email?: string;
  providerType?: OAuthProvider;
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

// types/auth.ts에서 이동 - Apple Sign In 관련
interface ClientConfig {
  clientId: string;
  redirectURI: string;
  scope?: string;
  state?: string;
  nonce?: string;
  usePopup?: boolean;
}

interface Authorization {
  code: string;
  id_token: string;
  state?: string;
}

export interface AppleSignInResponse {
  authorization: Authorization;
  user?: { email: string; name: { firstName: string; lastName: string } };
}

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: ClientConfig) => void;
        signIn: (config?: ClientConfig) => Promise<AppleSignInResponse>;
      };
    };
  }
}
