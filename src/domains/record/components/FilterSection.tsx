import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";

import { Level } from "@/domains/place/types/entity";
import { useDidMountEffect } from "@/hooks/common";
import { recordApi } from "@/domains/record/api/recordApi";
import { ClimbingPlace } from "@/domains/place/types/entity";

import LevelIcon from "@/domains/place/components/LevelIcon";
import LayerPopup from "@/components/popup/LayerPopup";
import Place from "@/domains/place/components/Place";

interface SelectedLevel {
  levelId: number;
  colorNameEn: Level["colorNameEn"] | "";
  colorNameKo: Level["colorNameKo"] | "전체";
  colorCode: Level["colorCode"] | "";
}

export default function FilterSection({
  filter,
  setFilter,
}: {
  filter: {
    gym: { id: number; name: string };
    level: { id: number; name: string };
  };
  setFilter: Dispatch<
    SetStateAction<{
      gym: { id: number; name: string };
      level: { id: number; name: string };
    }>
  >;
}) {
  const DEFAULT_LEVEL: SelectedLevel = {
    levelId: 0,
    colorNameEn: "",
    colorNameKo: "전체",
    colorCode: "",
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [levelList, setLevelList] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<SelectedLevel>({
    ...DEFAULT_LEVEL,
  });

  const selectPlace = ({ id, name }: ClimbingPlace) => {
    setIsPopupOpen(false);
    setFilter((prev) => ({
      ...prev,
      gym: {
        id,
        name,
      },
    }));
  };
  const resetSelectedPlace = () => {
    setFilter({
      gym: {
        id: 0,
        name: "",
      },
      level: {
        id: 0,
        name: "",
      },
    });
    setSelectedLevel({ ...DEFAULT_LEVEL });
    setLevelList([]);
  };

  useDidMountEffect(() => {
    const fetch = async () => {
      try {
        if (!filter.gym.id) {
          return;
        }
        const data = await recordApi.getLevelList(filter.gym.id);
        setLevelList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [filter.gym]);

  useDidMountEffect(() => {
    setFilter((prev) => ({
      ...prev,
      level: {
        id: selectedLevel.levelId,
        name: selectedLevel.colorNameKo,
      },
    }));
  }, [selectedLevel]);

  return (
    <section className="flex items-center">
      {/* 암장 검색 */}
      {filter.gym.id ? (
        <div className="flex px-[1.2rem] py-[1rem] bg-[#FFC6BD] bg-opacity-30 rounded-xl text-sm text-primary">
          {filter.gym.name}
          <span className="pl-[0.5rem]" onClick={resetSelectedPlace}>
            <Image
              src="/icons/icon-filter-cancel.svg"
              alt="취소"
              width="16"
              height="16"
            />
          </span>
        </div>
      ) : (
        <button
          className="flex px-[1.2rem] py-[1rem] bg-shadow-lighter rounded-xl text-sm"
          onClick={() => setIsPopupOpen(true)}
        >
          <span className="pr-[0.5rem]">전체 암장</span>
          <Image
            src="/icons/icon-arrow-right.svg"
            alt="선택"
            width="16"
            height="16"
          />
        </button>
      )}
      <div
        className={`px-[1.2rem] py-[1rem] ml-[0.8rem] rounded-xl text-sm
          ${
            selectedLevel.colorNameEn
              ? "bg-[#FFC6BD] bg-opacity-30"
              : "bg-shadow-lighter"
          }`}
      >
        <Listbox value={selectedLevel} onChange={setSelectedLevel}>
          <ListboxButton
            className={`flex items-center rounded-lg
              ${selectedLevel.colorCode && "text-primary"}`}
          >
            <span className="pr-[0.4rem]">
              {selectedLevel && selectedLevel.colorNameKo}
            </span>
            {selectedLevel.colorNameEn && (
              <LevelIcon color={selectedLevel.colorNameEn} />
            )}
            <BottomArrowIcon color={selectedLevel.colorNameEn && "#FF5C75"} />
          </ListboxButton>

          {/* 난이도 */}
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              anchor="bottom"
              className="w-[8.6rem] p-[0.1rem] mt-[1.4rem] bg-white rounded-xl border border-shadow-lighter focus:outline-none"
            >
              {[{ ...DEFAULT_LEVEL }, ...levelList].map((level, idx) => (
                <ListboxOption
                  key={idx}
                  value={level}
                  className="group flex items-center gap-2 rounded-lg py-[0.6rem] px-3 data-[focus]:text-primary hover:bg-[#FFC6BD] hover:bg-opacity-30"
                >
                  <div className="flex items-center text-sm text-shadow-darker">
                    <span className="pr-[0.4rem]">{level.colorNameKo}</span>
                    {level.colorNameEn && (
                      <LevelIcon color={level.colorNameEn} />
                    )}
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </Listbox>
      </div>

      <LayerPopup
        fullscreen
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      >
        <LayerPopup.Header title="암장 검색하기" />
        <LayerPopup.Body>
          <Place onSearchedPlaceClick={selectPlace} />
        </LayerPopup.Body>
      </LayerPopup>
    </section>
  );
}

const BottomArrowIcon = ({ color = "" }) => {
  return (
    <svg
      className="ml-[0.8rem]"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L7.5286 9.79026C7.78895 10.0699 8.21106 10.0699 8.47141 9.79026L12 6"
        stroke={color ? color : "#292929"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
