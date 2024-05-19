import { ButtonHTMLAttributes, PropsWithChildren } from "react";

const BottomActionButton = ({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
  return (
    <div className="fixed inset-x-0 bottom-0 p-[2rem] pt-[0.5rem] bg-white shadow-white-top">
      <button
        className="w-full h-[4.8rem] font-bold rounded-[1rem] bg-primary text-white hover:bg-primary/90 disabled:bg-shadow-light"
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default BottomActionButton;
