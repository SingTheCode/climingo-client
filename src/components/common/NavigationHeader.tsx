/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

type BackButtonType = "default" | "home";
type NavigationHeaderProps = {
  pageTitle?: string;
  hideBackButton?: boolean;
  backButtonType?: BackButtonType;
  rightElement?: React.ReactNode;
};

const NavigationHeader = ({
  pageTitle,
  hideBackButton = false,
  backButtonType = "default",
  rightElement,
}: NavigationHeaderProps) => {
  return (
    <nav className="h-[4.8rem] fixed top-0 left-0 flex items-center justify-between w-screen z-30 overflow-y-hidden bg-white">
      {/** left */}
      <div className="flex p-[0.2rem] basis-[10rem]">
        {!hideBackButton && <BackButton backButtonType={backButtonType} />}
      </div>

      {/** center */}
      <h2 className="text-center text-base font-medium flex-grow">
        {pageTitle}
      </h2>

      {/** right */}
      <div className="flex basis-[10rem] justify-end pr-[1.5rem] py-[0.2rem]">
        {rightElement}
      </div>
    </nav>
  );
};

export default NavigationHeader;

const BackButton = ({ backButtonType }: { backButtonType: BackButtonType }) => {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <button className="p-[0.8rem]" onClick={goBack}>
      {backButtonType === "default" && (
        <img
          src="/icons/icon-back.svg"
          alt="뒤로 가기"
          width="24"
          height="24"
        />
      )}
      {backButtonType === "home" && (
        <img
          src="/icons/icon-back-home.svg"
          alt="홈으로 가기"
          width="44"
          height="24"
        />
      )}
    </button>
  );
};
