export interface Jjikboul {
  jjikboulId: number;
  problemType: string;
  description: string;
  problemUrl: string;
}

export interface MemberInfo {
  memberId: number;
  nickname: string;
  profileUrl: string;
}

export interface Gym {
  gymId: number;
  name: string;
  address: string;
}

export interface Level {
  levelId: number;
  name: string;
  color: string;
}

export interface JjikboulDetail {
  jjikboul: Jjikboul;
  memberInfo: MemberInfo;
  gym: Gym;
  level: Level;
  isEditable: boolean;
  isDeletable: boolean;
}
