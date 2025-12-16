import { useQuery } from "@tanstack/react-query";

import { recordApi } from "@/domains/record/api/recordApi";
import type { GymResponse, LevelResponse } from "@/domains/record/types/response";
import { Gym, Level, LevelColor } from "@/types/record";
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
    colorNameKo: serverData.levelName ?? "",
    colorNameEn: (serverData.colorNameEn ?? "white") as LevelColor,
    colorCode:
      LEVELS.find((l) => l.colorNameEn === (serverData.colorNameEn ?? "white"))
        ?.colorCode || "#ffffff",
  };
};

// 기록 상세 조회
export const useGetRecordDetailQuery = ({ recordId }: { recordId: string }) =>
  useQuery({
    queryKey: ["records", "detail", recordId],
    queryFn: () => recordApi.getRecordDetail(Number(recordId)),
  });
