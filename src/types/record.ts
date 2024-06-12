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
  recordId: string;
  thumbnailUrl: string;
  videoUrl: string;
  createTime: string;
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
