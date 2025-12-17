"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/common";
import { placeApi } from "@/domains/place/api/placeApi";
import { ClimbingPlace } from "@/domains/place/types/entity";

import SearchedPlace from "@/domains/place/components/SearchedPlace";
import InputText from "@/components/common/InputText";

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
      const data = await placeApi.searchClimbingPlace(debouncedText);
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
