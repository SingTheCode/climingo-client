export interface ClimbingPlace {
  id: number;
  address: string;
  zipCode?: string | null;
  name?: string;
}

// FIXME: 중복 선언되어 있으므로 제거 후 import하여 사용
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

export type Level = {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
};
