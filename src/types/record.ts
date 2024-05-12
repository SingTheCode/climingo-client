export interface Record {
  recordId: string;
  videoUrl: string;
}

export interface Gym {
  gymId: string;
  gymName: string;
}

// TODO: 색깔 한글, 영어 api key 통일
export interface Grade {
  gradeId: string;
  colorNameKo: string;
  colorNameEn: string;
}
