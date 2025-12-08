export default function LevelIcon({ color }: { color: string }) {
  const level = `bg-level-${color}`;

  return (
    <div
      className={`w-[1rem] h-[1rem] ${level} border-[0.05rem] border-shadow-light rounded-full`}
    />
  );
}
