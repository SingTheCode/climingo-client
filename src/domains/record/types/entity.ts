// Record Entity 타입 정의 (기존 types/record.ts와 호환)

export interface Record {
  recordId: number;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
}

export interface Gym {
  gymId: number;
  gymName: string;
}

export type LevelColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'navy'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'grey'
  | 'white'
  | 'black';

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
  colorCode: string;
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
