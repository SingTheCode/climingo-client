// Record Entity 타입 정의

export interface Record {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: Date;
}

export interface Gym {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Level {
  id: number;
  name: string;
  color: string;
}

export interface MemberInfo {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface RecordMetadata {
  record: Record;
  gym: Gym;
  level: Level;
  memberInfo: MemberInfo | null;
}

export interface RecordList {
  records: RecordMetadata[];
  totalElements: number;
  totalPages: number;
  size: number;
  currentPage: number;
  isFirst: boolean;
  isLast: boolean;
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
