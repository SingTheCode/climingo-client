"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { ClimbingPlace } from "@/types/common";
import { Level } from "@/types/record";

import { LEVELS } from "@/constants/level";
import { Heading, Placeholder } from "@/components/record/commonText";
import ClearButton from "@/components/record/ClearButton";

const SelectPlaceWithLevelSection = () => {
  const [place, setPlace] = useState<ClimbingPlace>();
  const levelRef = useRef<Level>();

  const handlePlaceSelect = () => {
    // TODO: 암장 검색 레이어팝업 노출 후 상태 업데이트
    setPlace({
      id: 1,
      name: "더클라임 클라이밍 강남점",
      address: "서울특별시 송파구 올림픽로 84",
    });
  };

  const handleLevelSelect = (level: Level) => {
    levelRef.current = level;
  };

  const resetAll = () => {
    setPlace(undefined);
    levelRef.current = undefined;
  };

  return (
    <section className="flex flex-col gap-[3rem]">
      <div className="flex flex-col gap-[1.4rem]">
        <Heading text="어떤 암장을 방문했나요?" />
        <PlaceSelector
          place={place}
          onClick={handlePlaceSelect}
          onClear={resetAll}
        />
      </div>
      <div className="flex flex-col gap-[1.4rem]">
        <Heading text="난이도를 선택해주세요" />
        <LevelSelector placeId={place?.id} onChange={handleLevelSelect} />
      </div>
    </section>
  );
};

export default SelectPlaceWithLevelSection;

const PlaceSelector = ({
  place,
  onClick,
  onClear,
}: {
  place?: ClimbingPlace;
  onClick?: () => void;
  onClear?: () => void;
}) => {
  return (
    <div
      className="h-[4.4rem] pl-[1.4rem] pr-[1.2rem] py-[1rem] w-full bg-shadow-lighter rounded-[0.8rem] flex justify-between items-center cursor-pointer hover:bg-shadow-light/30"
      onClick={onClick}
    >
      {!place ? (
        <>
          <Placeholder text="암장을 검색해보세요" />
          <Image
            src="/icons/icon-arrow-grey.svg"
            alt="선택"
            width="20"
            height="20"
          />
        </>
      ) : (
        <>
          <p className="text-sm text-shadow-darkest">{place.name}</p>
          <ClearButton onClick={onClear} />
        </>
      )}
    </div>
  );
};

// FIXME: useQuery로 작성 후 대체
const useLevelQuery = (_placeId?: number) => {
  return {
    data: LEVELS,
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
          key={level.colorNameEn}
          level={level}
          onClick={handleItemClick}
        />
      ))}
    </ul>
  );
};

const LevelRadioItem = ({
  level,
  onClick,
}: {
  level: Level;
  onClick?: (level: Level) => void;
}) => {
  const { colorNameEn, colorNameKo, colorCode } = level;

  return (
    <li>
      <input
        type="radio"
        id={colorNameEn.toString()}
        name="level"
        value={colorNameEn}
        className="peer hidden"
      />
      <label
        className={`w-[7.2rem] h-[3.2rem] rounded-[3.2rem] border-[0.1rem] cursor-pointer flex justify-center items-center shrink-0 gap-[0.5rem] border-shadow-lighter peer-checked:bg-primary-lightest/30 peer-checked:border-primary-lightest peer-checked:text-primary`}
        htmlFor={colorNameEn.toString()}
        onClick={() => onClick?.(level)}
      >
        <p className="text-sm">{colorNameKo}</p>
        <div
          className="w-[1.2rem] h-[1.2rem] rounded-full border-[0.05rem] border-shadow-light"
          style={{ backgroundColor: colorCode }}
        />
      </label>
    </li>
  );
};
