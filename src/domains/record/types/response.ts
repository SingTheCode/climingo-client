// Record API Response 타입 정의

export interface RecordResponse {
  recordId: number;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
}

export interface GymResponse {
  gymId: number;
  gymName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LevelResponse {
  levelId: number;
  levelName: string;
  levelColor: string;
  colorNameEn?: string;
}

export interface MemberInfoResponse {
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  profileUrl?: string;
}

export interface RecordMetadataResponse {
  record: RecordResponse;
  gym: GymResponse;
  level: LevelResponse;
  memberInfo?: MemberInfoResponse;
}

export interface RecordListResponse {
  contents: RecordMetadataResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface RecordDetailResponse extends RecordMetadataResponse {
  description?: string;
  tags?: string[];
}

export interface ReportReasonResponse {
  reasonId: number;
  reasonText: string;
}
