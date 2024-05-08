"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/common";
import InputText from "@/components/common/InputText";
import { searchClimbingPlaceApi } from "@/api/modules/common";
import { ClimbingPlace } from "@/types/common";
import SearchedPlace from "@/app/place/searchedPlace";

export default function Place() {
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
    <div className="w-full">
      <InputText type="search" value={text} setText={setText} />

      {/*검색 결과 목록*/}
      {searchedList.map((searched) => (
        <SearchedPlace
          key={searched.id}
          id={searched.id}
          name={searched.name}
          address={searched.address}
        />
      ))}
    </div>
  );
}
