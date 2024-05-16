export interface Record {
  recordId: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface Gym {
  gymId: string;
  gymName: string;
}

export interface Level {
  levelId: string;
  colorNameKo: string;
  colorNameEn: LevelColor;
}
