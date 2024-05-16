import { Level } from "@/types/common";

import { BOULDER_LEVELS } from "@/constants/level";

import { Placeholder } from "@/components/record/commonText";
import LevelRadioItem from "@/components/record/LevelRadioItem";

// FIXME: useQuery로 작성 후 대체
const useLevelQuery = (_placeId?: number) => {
  return {
    data: BOULDER_LEVELS,
  };
};

const LevelSelector = ({
  placeId,
  onChange,
}: {
  placeId?: number;
  onChange?: (level: Level) => void;
}) => {
  const { data } = useLevelQuery(placeId);

  const handleItemClick = (level: Level) => {
    onChange?.(level);
  };

  if (!placeId) {
    return <Placeholder text="암장을 먼저 선택해주세요" />;
  }

  return (
    <ul className="flex flex-wrap gap-[1rem]">
      {data.map((level) => (
        <LevelRadioItem
          key={level.id}
          level={level}
          onClick={handleItemClick}
        />
      ))}
    </ul>
  );
};

export default LevelSelector;
