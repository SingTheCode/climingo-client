export default function Grade({ color }: { color: string }) {
  const grade = `bg-${color}`;

  return (
    <div
      className={`w-[1rem] h-[1rem] ${grade} border-[0.05rem] border-shadow-light rounded-full`}
    />
  );
}
