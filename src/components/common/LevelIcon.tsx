import { LevelColor } from "@/types/record";
import { LEVEL_COLOR } from "@/constants/level";

export default function LevelIcon({ color }: { color: LevelColor }) {
  const level = LEVEL_COLOR[color];

  return (
    <div
      className={`w-[1rem] h-[1rem] ${level} border-[0.05rem] border-shadow-light rounded-full`}
    />
  );
}
