import { LevelColor } from "@/types/record";

export interface ClimbingPlace {
  id: number;
  address: string;
  zipCode?: string | null;
  name: string;
}

export type Level = {
  id: string;
  colorName: LevelColor;
  colorCode?: string;
};
