import Image from "next/image";
import { ButtonHTMLAttributes, MouseEventHandler } from "react";

const ClearButton = ({
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const handleClear: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation(); // 상위 요소로 click event 버블링 중단
    onClick?.(event);
  };

  return (
    <button type="button" {...props} onClick={handleClear}>
      <Image width="20" height="20" src="/assets/cancel.svg" alt="초기화" />
    </button>
  );
};

export default ClearButton;
