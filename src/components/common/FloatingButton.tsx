import { ButtonHTMLAttributes } from "react";
import Image from "next/image";

const FloatingButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="fixed right-[2rem] bottom-[2rem] z-50 w-[6rem] h-[6rem] rounded-full bg-primary flex items-center justify-center hover:bg-primary/90"
      {...props}
    >
      <Image
        width="22"
        height="22"
        src="/icons/Icon-plus.svg"
        alt="기록 추가하기"
      />
    </button>
  );
};

export default FloatingButton;
