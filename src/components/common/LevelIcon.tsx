// TODO: 추후 타입 리팩토링
import { Level } from "@/types/record";

export default function LevelIcon({ color }: { color: Level["colorNameEn"] }) {
  const level = `bg-level-${color}`;

  return (
    <div
      className={`w-[1rem] h-[1rem] ${level} border-[0.05rem] border-shadow-light rounded-full`}
    />
  );
}
