export type OAuthProvider = "kakao" | "apple";

export interface MemberInfo {
  nickname: string;
  profileUrl: string;
  memberId?: number;
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
  memberInfo: MemberInfo & { providerToken: string };
}

export type MyProfileApiResponse = Required<
  Pick<
    MemberInfo,
    "memberId" | "nickname" | "providerType" | "profileUrl" | "email"
  >
>;

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

export interface SignInResponse {
  authorization: Authorization;
  user?: { email: string; name: string };
}

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: ClientConfig) => void;
        signIn: (config?: ClientConfig) => Promise<SignInResponse>;
      };
    };
  }
}
