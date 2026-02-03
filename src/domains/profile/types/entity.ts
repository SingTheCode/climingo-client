import type { OAuthProvider, MemberInfo } from "@/domains/auth/types/entity";
import type { RecordMetadata } from "@/domains/record/types/entity";

export interface Profile {
  memberId: number;
  nickname: string;
  providerType: OAuthProvider;
  profileUrl: string;
  email: string;
}

// types/auth.ts에서 이동
export type MyProfileApiResponse = Required<
  Pick<
    MemberInfo,
    "memberId" | "nickname" | "providerType" | "profileUrl" | "email"
  >
>;

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
