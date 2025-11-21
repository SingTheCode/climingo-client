import { Gym, Level } from "@/domains/record/types/record";

export interface Jjikboul {
  jjikboulId: number;
  problemType: string;
  description: string;
  problemUrl?: string;
}

export interface JjikboulDetail {
  jjikboul: Jjikboul;
  memberInfo: {
    memberId: number;
    nickname: string;
    profileUrl: string;
  };
  gym: Gym;
  level: Level;
  isEditable: boolean;
  isDeletable: boolean;
}

