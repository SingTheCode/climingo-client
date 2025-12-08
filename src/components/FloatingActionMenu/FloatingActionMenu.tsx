"use client";

import { createContext, useContext, useMemo } from "react";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { useNavigateWithAuth } from "@/hooks/navigate";
import { useFloatingActionMenu } from "./useFloatingActionMenu";

type FloatingActionMenuContextType = ReturnType<typeof useFloatingActionMenu>;

const FloatingActionMenuContext = createContext<FloatingActionMenuContextType | null>(null);

const useFloatingActionMenuContext = () => {
  const context = useContext(FloatingActionMenuContext);
  if (!context) {
    throw new Error('FloatingActionMenu 컴포넌트는 FloatingActionMenu.Root 내부에서 사용해야 합니다');
  }
  return context;
};

interface MenuOption {
  label: string;
  icon: string;
  onClick: () => void;
}

const FloatingActionMenuRoot = ({ children }: { children: React.ReactNode }) => {
  const store = useFloatingActionMenu();

  return (
    <FloatingActionMenuContext.Provider value={store}>
      {children}
    </FloatingActionMenuContext.Provider>
  );
};

const FloatingActionMenuBackdrop = () => {
  const { isOpen, close } = useFloatingActionMenuContext();

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
      <div className="fixed inset-0 bg-black/30 z-overlay" onClick={close} />
    </Transition>
  );
};

interface FloatingActionMenuItemsProps {
  options: MenuOption[];
}

const FloatingActionMenuItems = ({ options }: FloatingActionMenuItemsProps) => {
  const { isOpen } = useFloatingActionMenuContext();

  return (
    <>
      {options.map((option, index) => (
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
                : `${(options.length - 1 - index) * 50}ms`,
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
};

const FloatingActionMenuButton = () => {
  const { isOpen, toggle } = useFloatingActionMenuContext();

  return (
    <button
      onClick={toggle}
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
  );
};

const FloatingActionMenuContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed right-[2rem] bottom-[2rem] z-floating flex flex-col items-end gap-[1.2rem]">
      {children}
    </div>
  );
};

// 기본 구현 (기존 동작 유지)
const FloatingActionMenuDefault = () => {
  const navigateWithAuth = useNavigateWithAuth();
  const { close } = useFloatingActionMenuContext();

  const menuOptions: MenuOption[] = useMemo(
    () => [
      {
        label: "찍볼 만들기",
        icon: "/icons/icon-photo.svg",
        onClick: () => navigateWithAuth("/jjikboul/create", () => close()),
      },
      {
        label: "클라이밍 기록하기",
        icon: "/icons/icon-write.svg",
        onClick: () => navigateWithAuth("/record/create", () => close()),
      },
    ],
    [navigateWithAuth, close]
  );

  return (
    <>
      <FloatingActionMenuBackdrop />
      <FloatingActionMenuContainer>
        <FloatingActionMenuItems options={menuOptions} />
        <FloatingActionMenuButton />
      </FloatingActionMenuContainer>
    </>
  );
};

const FloatingActionMenu = Object.assign(FloatingActionMenuRoot, {
  Backdrop: FloatingActionMenuBackdrop,
  Container: FloatingActionMenuContainer,
  Items: FloatingActionMenuItems,
  Button: FloatingActionMenuButton,
  Default: FloatingActionMenuDefault,
  useFloatingActionMenu,
});

export default FloatingActionMenu;
