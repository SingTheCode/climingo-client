import type { OAuthProvider } from '@/domains/auth/types/entity';
import type { RecordMetadata } from '@/types/record';

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

export interface MyRecordListParams {
  page?: number;
  size?: number;
}

export interface MyRecordList {
  contents: RecordMetadata[];
  totalCount: number;
  resultCount: number;
  isEnd: boolean;
}
