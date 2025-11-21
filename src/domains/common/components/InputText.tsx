"use client";

import {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";

// valid 면 true 를, invalid 면 노출할 문구를 반환
interface ValidationRule {
  (value: string): true | string;
}

interface InputProps extends Partial<HTMLInputElement> {
  type?: "text" | "search";
  value: string;
  setText: Dispatch<SetStateAction<string>>;
  // 프론트 유효성 검사
  rules?: ValidationRule[];
  // 우선 유효성 검사 결과 노출
  serverValidation?: {
    isValid: boolean;
    text: string;
  };
  checkValid?: (isValid: boolean) => void;
}

export default function InputText(props: InputProps) {
  const { value, setText, rules, serverValidation, checkValid } = props;

  const onValidAction = useRef(false);
  const isClientValid = useRef(true);
  const [clientValidationText, setClientValidationText] = useState("");

  const inputRef = createRef<HTMLInputElement>();

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setText("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    // 외부에서 설정한 validation 상태가 없고, value 가 0보다 클 때 valid 활성화
    if ((!serverValidation || serverValidation.isValid) && value.length === 0) {
      onValidAction.current = false;
      return;
    }
    onValidAction.current = true;

    if (!rules) {
      return;
    }

    // 프론트 유효성 검사
    const invalidRule = rules.find((rule) => typeof rule(value) === "string");
    if (!invalidRule) {
      isClientValid.current = true;
      setClientValidationText("");
      return;
    }
    isClientValid.current = false;
    setClientValidationText(invalidRule(value) as string);
  }, [inputRef, rules, value, serverValidation, props]);

  useEffect(() => {
    if (!serverValidation) {
      return;
    }

    if (!serverValidation.isValid) {
      onValidAction.current = true;
      isClientValid.current = false;
      setClientValidationText(serverValidation.text);
    }
  }, [serverValidation]);

  useEffect(() => {
    if (!checkValid) {
      return;
    }
    checkValid(
      (onValidAction && isClientValid.current) || !!serverValidation?.isValid
    );
  }, [value, onValidAction, isClientValid.current, serverValidation?.isValid]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="relative mt-2 w-full rounded-md shadow-sm">
          {props.type === "search" && (
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
            ref={inputRef}
            type="text"
            name={props.name}
            className={`block w-full h-[4.4rem] bg-shadow-lighter rounded-[0.8rem] py-[1rem] text-sm border-[0.1rem] ${
              props.type === "search" ? "pl-[4.4rem]" : "pl-[1.6rem]"
            } pr-[4.8rem] placeholder:text-shadow ${onValidAction ? "" : ""} ${
              onValidAction && clientValidationText && !isClientValid.current
                ? "border-red"
                : "border-shadow-lighter"
            } focus:outline-none`}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            onChange={(e) => props.setText(e.target.value)}
          />
          {props.value.length > 0 && (
            <button
              className="absolute inset-y-0 right-[1.2rem] flex items-center"
              onClick={resetInput}
            >
              <Image
                src="/assets/cancel.svg"
                alt="취소"
                width="24"
                height="24"
              />
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center pt-[0.8rem] text-xs">
        <span
          className={`${
            onValidAction &&
            (clientValidationText && isClientValid.current
              ? "text-green"
              : "text-red")
          }`}
        >
          {onValidAction && clientValidationText}
        </span>
        <div>
          {props.maxLength && (
            <>
              <span>{props.value.length}</span>
              <span className="text-shadow-dark">/{props.maxLength}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
