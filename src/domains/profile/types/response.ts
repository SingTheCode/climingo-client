import type { OAuthProvider } from '@/domains/auth/types/entity';

export interface MyProfileResponse {
  memberId: number;
  nickname: string;
  providerType: OAuthProvider;
  profileUrl: string;
  email: string;
}

export interface EditNicknameResponse {
  nickname: string;
}
