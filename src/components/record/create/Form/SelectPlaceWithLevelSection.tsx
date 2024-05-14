"use client";

import { useRef, useState } from "react";

import { ClimbingPlace, Level } from "@/types/common";

import { Heading } from "@/components/record/create/common";
import {
  PlaceSelector,
  LevelSelector,
} from "@/components/record/create/selectors";

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
