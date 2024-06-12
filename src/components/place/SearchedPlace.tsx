import { MouseEventHandler } from "react";
import { ClimbingPlace } from "@/types/common";

export default function SearchedPlace({
  id,
  address,
  name,
  onClick,
}: ClimbingPlace & { onClick?: MouseEventHandler }) {
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
}
