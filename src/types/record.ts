import { Pagination } from "@/types/common";
import { MemberInfo } from "@/types/auth";

export type LevelColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "navy"
  | "purple"
  | "pink"
  | "brown"
  | "gray"
  | "white"
  | "black";

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

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
  colorCode: string;
}

export interface RecordMetadata {
  record: Record;
  gym: Gym;
  level: Level;
  memberInfo?: MemberInfo;
}

export interface RecordListApiResponse extends Pagination {
  contents: RecordMetadata[];
}
