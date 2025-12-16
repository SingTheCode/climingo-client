"use client";

import {
  ButtonHTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  useState,
} from "react";
import { flushSync } from "react-dom";

const BottomActionButton = ({
  children,
  onClick,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      return;
    }

    // 로딩 상태를 동기적으로(즉시) UI에 반영하기 위해 flushSync 사용
    flushSync(() => setIsLoading(true));
    await onClick?.(event);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 p-[2rem] pt-[0.5rem] bg-white shadow-white-top">
      <button
        className="w-full h-[4.8rem] font-bold rounded-[1rem] bg-primary text-white hover:bg-primary/90 disabled:bg-shadow-light"
        disabled={isLoading}
        onClick={handleButtonClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default BottomActionButton;
