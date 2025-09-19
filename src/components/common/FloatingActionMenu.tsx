"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Transition } from "@headlessui/react";

import { useNavigateWithAuth } from "@/hooks/common";

interface MenuOption {
  label: string;
  icon: string;
  onClick: () => void;
}

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigateWithAuth = useNavigateWithAuth();

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const menuOptions: MenuOption[] = useMemo(() => [
    {
      label: "찍볼 만들기",
      icon: "/icons/icon-photo.svg",
      onClick: () => navigateWithAuth("/jjikboul/create", () => setIsOpen(false)),
    },
    {
      label: "클라이밍 기록하기",
      icon: "/icons/icon-write.svg",
      onClick: () => navigateWithAuth("/record/create", () => setIsOpen(false)),
    },
  ], [navigateWithAuth]);

  return (
    <>
      <FloatingActionBackdrop
        isOpen={isOpen}
        onClose={handleClose}
      />

      <div className="fixed right-[2rem] bottom-[2rem] z-floating flex flex-col items-end gap-[1.2rem]">
        <FloatingActionMenuItems menuOptions={menuOptions} isOpen={isOpen} />

        <button
          onClick={handleToggle}
          className="w-[6rem] h-[6rem] rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 shadow-lg"
        >
          <div
            className={`transition-transform duration-200 ease-in-out ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <Image
              width="22"
              height="22"
              src="/icons/icon-plus.svg"
              alt={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default FloatingActionMenu;

interface BackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

function FloatingActionBackdrop({ isOpen, onClose }: BackdropProps) {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black/30 z-overlay" onClick={onClose} />
    </Transition>
  );
}

interface MenuItemsProps {
  menuOptions: MenuOption[];
  isOpen: boolean;
}

function FloatingActionMenuItems({ menuOptions, isOpen }: MenuItemsProps) {
  return (
    <>
      {menuOptions.map((option, index) => (
        <Transition
          key={option.label}
          show={isOpen}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <div
            className="transition-all"
            style={{
              transitionDelay: isOpen
                ? `${index * 50}ms`
                : `${(menuOptions.length - 1 - index) * 50}ms`,
            }}
          >
            <button
              onClick={option.onClick}
              className="flex items-center gap-[1.2rem] bg-white rounded-full px-[2rem] py-[1.2rem] shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <span className="text-sm font-medium text-ink whitespace-nowrap">
                {option.label}
              </span>
              <div className="w-[2.4rem] h-[2.4rem] flex items-center justify-center">
                <Image
                  width="20"
                  height="20"
                  src={option.icon}
                  alt={option.label}
                />
              </div>
            </button>
          </div>
        </Transition>
      ))}
    </>
  );
}
