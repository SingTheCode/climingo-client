export interface JjikboulResponse {
  jjikboulId: number;
  problemType: string;
  description: string;
  problemUrl?: string;
}

export interface MemberInfoResponse {
  memberId: number;
  nickname: string;
  profileUrl: string;
}

export interface GymResponse {
  gymId: number;
  name: string;
  address: string;
}

export interface LevelResponse {
  levelId: number;
  name: string;
  color: string;
}

export interface JjikboulDetailResponse {
  jjikboul: JjikboulResponse;
  memberInfo: MemberInfoResponse;
  gym: GymResponse;
  level: LevelResponse;
  isEditable: boolean;
  isDeletable: boolean;
}
