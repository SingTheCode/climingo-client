import { LEVELS } from "@/domains/record/constants/level";
import { LevelColor } from "@/domains/record/types/record";

// 서버 응답 타입
export interface GymResponse {
  gymId?: number;
  gymName?: string;
}

export interface LevelResponse {
  levelId?: number;
  colorNameKo?: string;
  colorNameEn?: string;
  colorCode?: string;
}

// 엔티티 타입
export interface Gym {
  gymId: number;
  gymName: string;
}

export interface Level {
  levelId: number;
  colorNameKo: string;
  colorNameEn: LevelColor;
  colorCode: string;
}

// Transform 함수
export const transformGym = (serverData: GymResponse): Gym => {
  return {
    gymId: serverData.gymId ?? 0,
    gymName: serverData.gymName ?? "",
  };
};

export const transformLevel = (serverData: LevelResponse): Level => {
  return {
    levelId: serverData.levelId ?? 0,
    colorNameKo: serverData.colorNameKo ?? "",
    colorNameEn: (serverData.colorNameEn ?? "white") as LevelColor,
    colorCode:
      LEVELS.find((l) => l.colorNameEn === (serverData.colorNameEn ?? "white"))
        ?.colorCode || "#ffffff",
  };
};
