"use client";

import { useEffect, useState, MouseEventHandler } from "react";

import { ClimbingPlace } from "@/types/common";

import { useDebounce } from "@/hooks/common";
import { searchClimbingPlaceApi } from "@/api/modules/common";

import InputText from "@/components/common/InputText";

const SearchPlace = ({
  onSearchedItemClick,
}: {
  onSearchedItemClick?: (place: ClimbingPlace) => void;
}) => {
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
    <div className="w-full py-[2rem]">
      <InputText type="search" value={text} setText={setText} />

      {/*검색 결과 목록*/}
      {searchedList.map((place) => (
        <SearchedPlaceItem
          key={place.id}
          id={place.id}
          name={place.name}
          address={place.address}
          onClick={() => onSearchedItemClick?.(place)}
        />
      ))}
    </div>
  );
};

export default SearchPlace;

const SearchedPlaceItem = ({
  id,
  address,
  name,
  onClick,
}: ClimbingPlace & { onClick?: MouseEventHandler }) => {
  return (
    <button
      type="button"
      name="암장검색결과클릭"
      id={id.toString()}
      className="w-full h-[8.5rem] pt-[2rem] border-solid border-b-[0.1rem] border-shadow-lighter font-medium"
      onClick={onClick}
    >
      <div className="flex flex-col items-start">
        <span className="text-base">{name}</span>
        <div className="flex items-center h-[2rem] pt-[1rem]">
          <span className="px-[0.8rem] py-[0.4rem] rounded-lg bg-shadow-lighter text-2xs text-shadow-darker">
            도로명
          </span>
          <span className="pl-[0.5rem] text-sm">{address}</span>
        </div>
      </div>
    </button>
  );
};
