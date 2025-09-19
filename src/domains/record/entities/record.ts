import { MemberInfo } from "@/domains/user/entities/profile";
import { Gym } from "./gym";
import { Level } from "./level";

export interface Record {
  recordId: number;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
}

export interface RecordDetail {
  record: Record;
  gym: Gym;
  level: Level;
  memberInfo?: MemberInfo;
}
