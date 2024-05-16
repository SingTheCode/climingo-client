import { ClimbingPlace } from "@/types/common";

import { Placeholder } from "@/components/record/commonText";
import ClearButton from "@/components/record/ClearButton";

type PlaceSelectorProps = {
  place?: ClimbingPlace;
  onClick?: () => void;
  onClear?: () => void;
};

const PlaceSelector = ({ place, onClick, onClear }: PlaceSelectorProps) => {
  return (
    <div
      className="h-[4.4rem] pl-[1.4rem] pr-[1.2rem] py-[1rem] w-full bg-shadow-lighter rounded-[0.8rem] flex justify-between items-center cursor-pointer hover:bg-shadow-light/30"
      onClick={onClick}
    >
      {!place ? (
        <>
          <Placeholder text="암장을 검색해보세요" />
          <img
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

export default PlaceSelector;
