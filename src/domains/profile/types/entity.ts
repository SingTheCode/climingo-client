import type { OAuthProvider } from '@/domains/auth/types/entity';

export interface Profile {
  memberId: number;
  nickname: string;
  providerType: OAuthProvider;
  profileUrl: string;
  email: string;
}

export interface EditNicknameRequest {
  memberId: number;
  nickname: string;
}
