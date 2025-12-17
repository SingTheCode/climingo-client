"use client";

import Image from "next/image";
import { MouseEventHandler, memo, useRef, useState } from "react";

import { ClimbingPlace } from "@/domains/place/types/entity";
import { Level } from "@/domains/place/types/entity";
import { useLevelListQuery } from "@/domains/place/hooks/useLevelListQuery";

import LayerPopup from "@/components/popup/LayerPopup";
import SearchPlace from "@/domains/place/components/Place";
import ClearButton from "@/domains/record/components/ClearButton";
import { Heading, Placeholder } from "@/domains/record/components/commonText";

const SelectPlaceWithLevel = memo(
  ({ validate }: { validate?: (valid: boolean) => void }) => {
    const [open, setOpen] = useState(false);

    const [place, setPlace] = useState<ClimbingPlace>();
    const levelRef = useRef<Level>();

    const handlePlaceSelect = (place: ClimbingPlace) => {
      setPlace({ ...place });
      setOpen(false);
      validate?.(false);
    };

    const handleLevelSelect = (level: Level) => {
      levelRef.current = level;
      validate?.(true);
    };

    const resetAll = () => {
      setPlace(undefined);
      levelRef.current = undefined;
      validate?.(false);
    };

    return (
      <section className="flex flex-col gap-[3rem]">
        <div className="flex flex-col gap-[1.4rem]">
          <Heading text="어떤 암장을 방문했나요?" />
          <PlaceSelector
            place={place}
            onClick={() => setOpen(true)}
            onClear={resetAll}
          />
          <LayerPopup open={open} onClose={() => setOpen(false)} fullscreen>
            <LayerPopup.Header title="암장 검색하기" />
            <LayerPopup.Body>
              <SearchPlace onSearchedPlaceClick={handlePlaceSelect} />
            </LayerPopup.Body>
          </LayerPopup>
        </div>
        <div className="flex flex-col gap-[1.4rem]">
          <Heading text="난이도를 선택해주세요" />
          <LevelSelector placeId={place?.id} onChange={handleLevelSelect} />
        </div>
      </section>
    );
  }
);

SelectPlaceWithLevel.displayName = "SelectPlaceWithLevelSection";

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
          <input id="place" name="place" value={place?.id} hidden readOnly />
        </>
      )}
    </div>
  );
};

const LevelSelector = ({
  placeId,
  onChange,
}: {
  placeId?: number;
  onChange?: (level: Level) => void;
}) => {
  const { data, isSuccess } = useLevelListQuery(placeId);

  if (!placeId) {
    return <Placeholder text="암장을 먼저 선택해주세요" />;
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-[1rem]">
      {data.map((level) => (
        <LevelRadioItem
          key={level.levelId}
          level={level}
          onClick={() => onChange?.(level)}
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
  onClick?: MouseEventHandler;
}) => {
  const { levelId, colorNameKo, colorNameEn } = level;

  return (
    <li>
      <input
        type="radio"
        id={colorNameEn}
        name="level"
        value={levelId}
        className="peer hidden"
      />
      <label
        className={`w-[7.2rem] h-[3.2rem] rounded-[3.2rem] border-[0.1rem] cursor-pointer flex justify-center items-center shrink-0 gap-[0.5rem] border-shadow-lighter peer-checked:bg-primary-lightest/30 peer-checked:border-primary-lightest peer-checked:text-primary`}
        htmlFor={colorNameEn}
        onClick={onClick}
      >
        <p className="text-sm">{colorNameKo}</p>
        <div
          className={`w-[1.2rem] h-[1.2rem] rounded-full border-[0.05rem] border-shadow-light bg-level-${colorNameEn}`}
        />
      </label>
    </li>
  );
};

export default SelectPlaceWithLevel;
