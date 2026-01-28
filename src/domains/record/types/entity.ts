// Record Entity 타입 정의 (기존 types/record.ts와 호환)

import { Gym, Level } from "@/domains/place/types/entity";

export interface Record {
  recordId: number;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
}

export interface MemberInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  profileUrl: string;
}

export interface RecordMetadata {
  record: Record;
  gym: Gym;
  level: Level;
  memberInfo: MemberInfo | null;
}

export interface RecordList {
  contents: RecordMetadata[];
  totalCount: number;
  totalPage: number;
  page: number;
  isEnd: boolean;
}

export interface RecordDetail extends RecordMetadata {
  description: string;
  tags: string[];
}

export interface ReportReason {
  id: number;
  text: string;
}

// 필터 타입
export interface RecordFilter {
  gymId?: number;
  levelId?: number;
  memberId?: number;
  page?: number;
  size?: number;
}

// API 응답 타입 (types/record.ts에서 이동)
export interface RecordListApiResponse {
  contents: RecordMetadata[];
  totalCount: number;
  resultCount: number;
  totalPage: number;
  page: number;
  isEnd: boolean;
}

export interface RecordReportApiRequest {
  reasonCode: string;
}
