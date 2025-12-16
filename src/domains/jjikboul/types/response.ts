import type { MemberInfoResponse } from '@/domains/auth/types/response';
import type { GymResponse, LevelResponse } from '@/domains/record/types/response';

export interface JjikboulResponse {
  jjikboulId: number;
  problemType: string;
  description: string;
  problemUrl?: string;
}

export interface JjikboulDetailResponse {
  jjikboul: JjikboulResponse;
  memberInfo: MemberInfoResponse;
  gym: GymResponse;
  level: LevelResponse;
  isEditable: boolean;
  isDeletable: boolean;
}
