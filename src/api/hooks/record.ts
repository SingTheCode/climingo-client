import { useQuery } from "@tanstack/react-query";

import {
  getRecordDetailApi,
  GymResponse,
  LevelResponse,
} from "@/api/modules/record";
import { Gym, Level } from "@/types/record";
import { LEVELS } from "@/constants/level";

export const GymModel = (serverData: GymResponse): Gym => {
  return {
    gymId: serverData.gymId ?? 0,
    gymName: serverData.gymName ?? "",
  };
};

export const LevelModel = (serverData: LevelResponse): Level => {
  return {
    levelId: serverData.levelId ?? 0,
    colorNameKo: serverData.colorNameKo ?? "",
    colorNameEn: serverData.colorNameEn ?? "white",
    colorCode:
      LEVELS.find((l) => l.colorNameEn === (serverData.colorNameEn ?? "white"))
        ?.colorCode || "#ffffff",
  };
};

// 기록 상세 조회
export const useGetRecordDetailQuery = ({ recordId }: { recordId: string }) =>
  useQuery({
    queryKey: ["records", "detail", recordId],
    queryFn: () => getRecordDetailApi({ recordId }),
  });
