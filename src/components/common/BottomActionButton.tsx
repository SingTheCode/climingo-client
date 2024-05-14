import { ButtonHTMLAttributes, PropsWithChildren } from "react";

const BottomActionButton = ({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
  return (
    <button
      className="absolute inset-x-[2rem] bottom-[2rem] h-[4.8rem] font-bold rounded-[1rem] bg-primary text-[#ffffff] hover:bg-primary/90 disabled:bg-shadow-light"
      {...props}
    >
      {children}
    </button>
  );
};

export default BottomActionButton;
