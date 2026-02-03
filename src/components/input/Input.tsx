"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface InputContextValue {
  value: string;
  setValue: (value: string) => void;
  isValid: boolean;
  validationText: string;
  showValidation: boolean;
  maxLength?: number;
}

const InputContext = createContext<InputContextValue | null>(null);

const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("Input 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

interface InputProps {
  initialValue?: string;
  rules?: Array<(value: string) => true | string>;
  maxLength?: number;
  children: ReactNode;
}

export const Input = ({
  initialValue = "",
  rules,
  maxLength,
  children,
}: InputProps) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [validationText, setValidationText] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (value.length === 0) {
      setShowValidation(false);
      return;
    }

    setShowValidation(true);

    if (!rules) {
      setIsValid(true);
      setValidationText("");
      return;
    }

    const invalidRule = rules.find((rule) => typeof rule(value) === "string");
    if (!invalidRule) {
      setIsValid(true);
      setValidationText("");
      return;
    }

    setIsValid(false);
    setValidationText(invalidRule(value) as string);
  }, [value, rules]);

  return (
    <InputContext.Provider
      value={{
        value,
        setValue,
        isValid,
        validationText,
        showValidation,
        maxLength,
      }}
    >
      <div className="w-full">{children}</div>
    </InputContext.Provider>
  );
};

interface FieldProps {
  type?: "text" | "search";
  placeholder?: string;
  name?: string;
}

const Field = ({ type = "text", placeholder, name }: FieldProps) => {
  const { value, setValue, isValid, showValidation, maxLength } =
    useInputContext();

  return (
    <div className="relative mt-2 w-full rounded-md shadow-sm">
      {type === "search" && (
        <div className="pointer-events-none absolute left-[1.2rem] inset-y-0 flex items-center">
          <Image src="/assets/search.svg" alt="검색" width={16} height={16} />
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        className={`block w-full h-[4.4rem] bg-shadow-lighter rounded-[0.8rem] py-[1rem] text-sm border-[0.1rem] ${
          type === "search" ? "pl-[4.4rem]" : "pl-[1.6rem]"
        } pr-[4.8rem] placeholder:text-shadow ${
          showValidation && !isValid ? "border-red" : "border-shadow-lighter"
        } focus:outline-none`}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
      />
      {value.length > 0 && <Input.Clear />}
    </div>
  );
};

Input.Field = Field;

const Clear = () => {
  const { setValue } = useInputContext();

  return (
    <button
      className="absolute inset-y-0 right-[1.2rem] flex items-center"
      onClick={() => setValue("")}
    >
      <Image src="/assets/cancel.svg" alt="취소" width={24} height={24} />
    </button>
  );
};

Input.Clear = Clear;

const Validation = () => {
  const { validationText, showValidation, isValid } = useInputContext();

  return (
    <span
      className={`${showValidation && (isValid ? "text-green" : "text-red")}`}
    >
      {showValidation && validationText}
    </span>
  );
};

Input.Validation = Validation;

const Counter = () => {
  const { value, maxLength } = useInputContext();

  if (!maxLength) {
    return null;
  }

  return (
    <div>
      <span>{value.length}</span>
      <span className="text-shadow-dark">/{maxLength}</span>
    </div>
  );
};

Input.Counter = Counter;

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-between items-center pt-[0.8rem] text-xs">
      {children}
    </div>
  );
};

Input.Footer = Footer;
