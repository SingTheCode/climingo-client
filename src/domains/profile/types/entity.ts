import type { OAuthProvider, MemberInfo } from "@/domains/auth/types/entity";
import type { RecordMetadata } from "@/domains/record/types/entity";

export interface PhysicalInfo {
  weight?: number;
  height?: number;
  armSpan?: number;
}

export interface Profile {
  memberId: number;
  nickname: string;
  providerType: OAuthProvider;
  profileUrl: string;
  email: string;
  physicalInfo?: PhysicalInfo;
}

// types/auth.ts에서 이동
export type MyProfileApiResponse = Required<
  Pick<
    MemberInfo,
    "memberId" | "nickname" | "providerType" | "profileUrl" | "email"
  >
>;

export interface MyRecordList {
  contents: RecordMetadata[];
  totalCount: number;
  resultCount: number;
  isEnd: boolean;
}
