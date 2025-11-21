"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/domains/common/core/common";
import { searchClimbingPlaceApi } from "@/api/modules/common";
import { ClimbingPlace } from "@/domains/common/types/common";

import SearchedPlace from "@/domains/place/components/SearchedPlace";
import InputText from "@/domains/common/components/InputText";

export default function Place({
  onSearchedPlaceClick,
}: {
  onSearchedPlaceClick?: (place: ClimbingPlace) => void;
}) {
  const [text, setText] = useState("");
  const [searchedList, setSearchedList] = useState<ClimbingPlace[]>([]);
  const debouncedText = useDebounce<string>(text, 500);

  useEffect(() => {
    const fetch = async () => {
      const data = await searchClimbingPlaceApi(debouncedText);
      setSearchedList(data);
    };
    fetch();
  }, [debouncedText]);

  return (
    <div className="w-full pt-[2rem]">
      <InputText type="search" value={text} setText={setText} />

      {/*검색 결과 목록*/}
      {searchedList.map((searched) => (
        <SearchedPlace
          key={searched.id}
          place={searched}
          onClick={onSearchedPlaceClick}
        />
      ))}
    </div>
  );
}
