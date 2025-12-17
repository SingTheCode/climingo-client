import type { OAuthProvider } from "@/domains/auth/types/entity";
import type { RecordMetadata } from "@/domains/record/types/entity";
import type { Pagination } from "@/types/common";

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

export interface MyRecordListResponse extends Pagination {
  contents: RecordMetadata[];
}
