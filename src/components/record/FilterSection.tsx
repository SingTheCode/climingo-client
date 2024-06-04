import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";

import { LevelColor } from "@/types/record";
import { useDidMountEffect } from "@/hooks/common";
import { BOULDER_LEVELS } from "@/constants/level";
import LevelIcon from "@/components/common/LevelIcon";
import LayerPopup from "@/components/common/LayerPopup";
import Layout from "@/components/common/Layout";
import Place from "@/components/place/Place";

export default function FilterSection({
  filter,
  setFilter,
}: {
  filter: {
    gym: { id: string; name: string };
    level: { id: string; name: string };
  };
  setFilter: Dispatch<
    SetStateAction<{
      gym: { id: string; name: string };
      level: { id: string; name: string };
    }>
  >;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<{
    id: LevelColor | "";
    colorName: string;
    colorCode: string;
  }>({
    id: "",
    colorCode: "",
    colorName: "전체",
  });

  const selectPlace = ({ id, name }: { id: string; name: string }) => {
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
    setFilter((prev) => ({
      ...prev,
      gym: {
        id: "",
        name: "",
      },
    }));
  };

  useDidMountEffect(() => {
    setFilter((prev) => ({
      ...prev,
      level: {
        id: selectedLevel.id,
        name: selectedLevel.colorName,
      },
    }));
  }, [selectedLevel]);

  return (
    <section className="flex items-center">
      {filter.gym.id ? (
        <span className="px-[1.2rem] py-[1rem] bg-[#FFC6BD] bg-opacity-30 rounded-xl text-sm text-primary">
          {filter.gym.name}
          <span className="pl-[1rem]" onClick={resetSelectedPlace}>
            x
          </span>
        </span>
      ) : (
        <button
          className="px-[1.2rem] py-[1rem] bg-shadow-lighter rounded-xl text-sm"
          onClick={() => setIsPopupOpen(true)}
        >
          <span className="pr-[1rem]">전체 암장</span>
          {">"}
        </button>
      )}
      <div
        className={clsx(
          "px-[1.2rem] py-[1rem] ml-[0.8rem] rounded-xl text-sm",
          `${
            selectedLevel.id
              ? "bg-[#FFC6BD] bg-opacity-30"
              : "bg-shadow-lighter"
          }`
        )}
      >
        <Listbox value={selectedLevel} onChange={setSelectedLevel}>
          <ListboxButton
            className={clsx(
              "flex items-center rounded-lg",
              `${selectedLevel.id && "text-primary"}`
            )}
          >
            <span className="pr-[0.4rem]">
              {selectedLevel && selectedLevel.colorName}
            </span>
            {selectedLevel.id && <LevelIcon color={selectedLevel.id} />}
            <BottomArrowIcon color={selectedLevel.id && "#FF5C75"} />
          </ListboxButton>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              anchor="bottom"
              className="w-[8.6rem] p-[0.1rem] mt-[1.4rem] bg-white rounded-xl border border-shadow-lighter focus:outline-none"
            >
              {[
                { id: "", colorCode: "", colorName: "전체" },
                ...BOULDER_LEVELS,
              ].map((level) => (
                <ListboxOption
                  key={level.id}
                  value={level}
                  className={clsx(
                    "group flex items-center gap-2 rounded-lg py-[0.6rem] px-3",
                    "data-[focus]:text-primary hover:bg-[#FFC6BD] hover:bg-opacity-30"
                  )}
                >
                  <div className="flex items-center text-sm text-shadow-darker">
                    <span className="pr-[0.4rem]">{level.colorName}</span>
                    {level.id && <LevelIcon color={level.id} />}
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
        <Layout containHeader>
          <Place onClick={selectPlace} />
        </Layout>
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
