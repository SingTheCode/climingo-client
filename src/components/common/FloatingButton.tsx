import { ButtonHTMLAttributes } from "react";

const FloatingButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="fixed right-[2rem] bottom-[2rem] z-50 w-[6rem] h-[6rem] rounded-full bg-primary flex items-center justify-center hover:bg-primary/90"
      {...props}
    >
      <img src="/icons/Icon-plus.svg" />
    </button>
  );
};

export default FloatingButton;
