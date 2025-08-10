export interface Jjikboul {
  id: string;
  problemType: string;
  description: string;
  createdDate: string;
}

export interface JjikboulDetail {
  jjikboul: Jjikboul;
  memberInfo: {
    id: string;
    nickname: string;
    profileUrl: string;
  };
  gym: {
    gymId: string;
    gymName: string;
  };
  level: {
    levelId: string;
    colorNameKo: string;
    colorNameEn: string;
  };
  isEditable: boolean;
  isDeletable: boolean;
}
