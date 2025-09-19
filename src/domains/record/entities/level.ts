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
  | "grey"
  | "white"
  | "black";

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
  colorCode: string;
}
