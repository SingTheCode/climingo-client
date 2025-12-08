"use client";

import { createContext, useContext, InputHTMLAttributes } from "react";
import Image from "next/image";
import { useInputText } from "./useInputText";

type InputTextContextType = ReturnType<typeof useInputText>;

const InputTextContext = createContext<InputTextContextType | null>(null);

const useInputTextContext = () => {
  const context = useContext(InputTextContext);
  if (!context) {
    throw new Error('InputText 컴포넌트는 InputText.Root 내부에서 사용해야 합니다');
  }
  return context;
};

interface ValidationRule {
  (value: string): true | string;
}

interface InputTextRootProps {
  rules?: ValidationRule[];
  serverValidation?: {
    isValid: boolean;
    text: string;
  };
  onValidChange?: (isValid: boolean) => void;
  children: React.ReactNode;
}

const InputTextRoot = ({
  rules,
  serverValidation,
  onValidChange,
  children,
}: InputTextRootProps) => {
  const store = useInputText({ rules, serverValidation, onValidChange });

  return (
    <InputTextContext.Provider value={store}>
      <div className="w-full">{children}</div>
    </InputTextContext.Provider>
  );
};

interface InputTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  type?: "text" | "search";
}

const InputTextField = ({ type = "text", ...props }: InputTextFieldProps) => {
  const { value, setValue, showValidation, isValid, validationText } = useInputTextContext();

  return (
    <div className="w-full">
      <div className="relative mt-2 w-full rounded-md shadow-sm">
        {type === "search" && (
          <div className="pointer-events-none absolute left-[1.2rem] inset-y-0 flex items-center">
            <Image
              src="/assets/search.svg"
              alt="검색"
              width="16"
              height="16"
            />
          </div>
        )}
        <input
          {...props}
          type="text"
          value={value}
          className={`block w-full h-[4.4rem] bg-shadow-lighter rounded-[0.8rem] py-[1rem] text-sm border-[0.1rem] ${
            type === "search" ? "pl-[4.4rem]" : "pl-[1.6rem]"
          } pr-[4.8rem] placeholder:text-shadow ${
            showValidation && validationText && !isValid
              ? "border-red"
              : "border-shadow-lighter"
          } focus:outline-none`}
          onChange={(e) => setValue(e.target.value)}
        />
        {value.length > 0 && <InputTextClearButton />}
      </div>
    </div>
  );
};

const InputTextClearButton = () => {
  const { reset } = useInputTextContext();

  return (
    <button
      className="absolute inset-y-0 right-[1.2rem] flex items-center"
      onClick={reset}
      type="button"
    >
      <Image
        src="/assets/cancel.svg"
        alt="취소"
        width="24"
        height="24"
      />
    </button>
  );
};

interface InputTextValidationProps {
  maxLength?: number;
}

const InputTextValidation = ({ maxLength }: InputTextValidationProps) => {
  const { value, showValidation, validationText, isValid } = useInputTextContext();

  return (
    <div className="flex justify-between items-center pt-[0.8rem] text-xs">
      <span
        className={`${
          showValidation &&
          (validationText && isValid ? "text-green" : "text-red")
        }`}
      >
        {showValidation && validationText}
      </span>
      <div>
        {maxLength && (
          <>
            <span>{value.length}</span>
            <span className="text-shadow-dark">/{maxLength}</span>
          </>
        )}
      </div>
    </div>
  );
};

const InputText = Object.assign(InputTextRoot, {
  Field: InputTextField,
  Validation: InputTextValidation,
  useInputText,
});

export default InputText;
