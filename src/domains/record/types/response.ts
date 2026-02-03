// Record API Response 타입 정의

import type { Pagination } from "@/types/common";

import type { LevelColor } from "@/domains/place/types/entity";

export interface RecordResponse {
  recordId: number;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
}

export interface GymResponse {
  gymId: number;
  gymName: string;
}

export interface LevelResponse {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
}

export interface MemberInfoResponse {
  authId?: string;
  email?: string;
  memberId: number;
  nickname: string;
  profileUrl: string;
  providerType?: string;
}

export interface RecordMetadataResponse {
  record: RecordResponse;
  gym: GymResponse;
  level: LevelResponse;
  memberInfo?: MemberInfoResponse;
}

export interface RecordListResponse extends Pagination {
  contents: RecordMetadataResponse[];
}

export interface RecordDetailResponse {
  memberInfo: MemberInfoResponse;
  record: RecordResponse;
  gym: GymResponse;
  level: LevelResponse;
  isDeletable: boolean;
}

export interface ReportReasonResponse {
  code: string;
  description: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  videoUrl: string;
}
