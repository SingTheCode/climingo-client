/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type NavigationHeaderProps = {
  pageTitle?: string;
  hideBackButton?: boolean;
  hideHomeButton?: boolean;
  rightElement?: React.ReactNode;
};

const NavigationHeader = ({
  pageTitle,
  hideBackButton = false,
  hideHomeButton = false,
  rightElement,
}: NavigationHeaderProps) => {
  return (
    <nav className="h-[4.8rem] fixed top-0 left-0 flex items-center justify-between w-screen z-[300] overflow-y-hidden bg-white">
      {/** left */}
      <div className="flex px-[0.2rem] basis-[10rem] gap-[0.4rem] items-center">
        {!hideBackButton && <BackButton />}
        {!hideHomeButton && <HomeButton />}
      </div>

      {/** center */}
      <h2 className="text-center text-base font-medium flex-grow">
        {pageTitle}
      </h2>

      {/** right */}
      <div className="flex basis-[10rem] justify-end  py-[0.2rem] items-center gap-[0.4rem] pr-[1rem]">
        {rightElement}
      </div>
    </nav>
  );
};

export default NavigationHeader;

const BackButton = () => {
  const router = useRouter();

  const goPrev = () => router.back();

  return (
    <button className="pl-[0.8rem] py-[0.8rem]" onClick={goPrev}>
      <img src="/icons/icon-back.svg" alt="뒤로 가기" width="24" height="24" />
    </button>
  );
};

const HomeButton = () => {
  return (
    <Link href="/">
      <button className="py-[0.8rem]">
        <img
          src="/icons/icon-home.svg"
          alt="홈으로 가기"
          width="24"
          height="24"
        />
      </button>
    </Link>
  );
};
