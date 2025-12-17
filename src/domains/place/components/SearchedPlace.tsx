import { ClimbingPlace } from "@/domains/place/types/entity";

export default function SearchedPlace({
  place,
  onClick,
}: {
  place: ClimbingPlace;
  onClick?: (place: ClimbingPlace) => void;
}) {
  const { id, address, name } = place;

  return (
    <button
      type="button"
      name="암장검색결과클릭"
      id={id.toString()}
      className="w-full py-[1.5rem] border-b-[0.1rem] border-shadow-lighter"
      onClick={() => onClick?.(place)}
    >
      <div className="flex flex-col items-start font-medium">
        <span className="text-base">{name}</span>
        <div className="flex items-start pt-[1rem] gap-[0.5rem]">
          <span className="px-[0.8rem] py-[0.4rem] rounded-lg bg-shadow-lighter text-2xs text-shadow-darker shrink-0">
            도로명
          </span>
          <span className="pl-[0.5rem] text-sm text-start font-normal break-keep">
            {address}
          </span>
        </div>
      </div>
    </button>
  );
}
