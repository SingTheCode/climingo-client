import type { Pagination } from "@/types/common";

import type { OAuthProvider } from "@/domains/auth/types/entity";
import type { PhysicalInfo } from "@/domains/profile/types/entity";
import type { RecordMetadataResponse } from "@/domains/record/types/response";

export interface MyProfileResponse {
  memberId: number;
  nickname: string;
  providerType: OAuthProvider;
  profileUrl: string;
  email: string;
  physicalInfo?: PhysicalInfo;
}

export interface EditNicknameResponse {
  nickname: string;
}

export type EditProfileResponse = PhysicalInfo;

export interface MyRecordListResponse extends Pagination {
  contents: RecordMetadataResponse[];
}
