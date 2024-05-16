import { Level } from "@/types/common";

type LevelRadioItemProps = {
  level: Level;
  onClick?: (level: Level) => void;
};

const LevelRadioItem = ({ level, onClick }: LevelRadioItemProps) => {
  const { id, colorName, colorCode } = level;

  return (
    <li>
      <input
        type="radio"
        id={id.toString()}
        name="level"
        value={id}
        className="peer hidden"
      />
      <label
        className={`w-[7.2rem] h-[3.2rem] rounded-[3.2rem] border-[0.1rem] cursor-pointer flex justify-center items-center shrink-0 gap-[0.5rem] border-shadow-lighter peer-checked:bg-primary-lightest/30 peer-checked:border-primary-lightest peer-checked:text-primary`}
        htmlFor={id.toString()}
        onClick={() => onClick?.(level)}
      >
        <p className="text-sm">{colorName}</p>
        <div
          className="w-[1.2rem] h-[1.2rem] rounded-full border-[0.05rem] border-shadow-light"
          style={{ backgroundColor: colorCode }}
        />
      </label>
    </li>
  );
};

export default LevelRadioItem;
