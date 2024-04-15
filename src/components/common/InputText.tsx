"use client";

import {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { Simulate } from "react-dom/test-utils";
import invalid = Simulate.invalid;

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
  invalidText?: string;
}

export default function InputText(props: InputProps) {
  const [onValidAction, setOnValidAction] = useState(false);
  const [validationInfo, setValidationInfo] = useState({
    isValid: true,
    text: "",
  });
  const inputRef = createRef<HTMLInputElement>();

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    props.setText("");
  };

  useEffect(() => {
    // 외부에서 설정한 validation 상태가 없고, value 가 0보다 클 때 valid 활성화
    if (!props.invalidText && props.value.length === 0) {
      setOnValidAction(false);
      return;
    }
    setOnValidAction(true);

    if (!props.rules) {
      return;
    }

    // 프론트 유효성 검사
    const invalidRule = props.rules.find(
      (rule) => typeof rule(props.value) === "string"
    );
    if (!invalidRule) {
      if (props.invalidText) {
        setValidationInfo({
          isValid: false,
          text: props.invalidText,
        });
        return;
      }
      setValidationInfo({
        isValid: true,
        text: "",
      });
      return;
    }
    setValidationInfo({
      isValid: false,
      text: invalidRule(props.value) as string,
    });
  }, [props.value]);
  useEffect(() => {
    if (props.invalidText) {
      setOnValidAction(true);
      setValidationInfo({ isValid: false, text: props.invalidText });
    }
  }, [props.invalidText]);

  return (
    <div>
      <div>
        <div className="relative mt-2 rounded-md shadow-sm">
          {props.type === "search" && (
            <div className="pointer-events-none absolute inset-y-0 left-[0.8rem] flex items-center pl-4">
              <Image src="/search.png" alt="검색" width="16" height="16" />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            name={props.name}
            className={`block w-[${props.width || "32rem"}] h-[${
              props.height || "4.4rem"
            }] bg-[#f2f4f5] rounded-lg py-1.5 ${
              props.type === "search" ? "pl-[4.4rem]" : "pl-[1.6rem]"
            } pr-[4.4rem] placeholder:text-gray-400 ${
              onValidAction ? "ring-2" : ""
            } ${
              onValidAction &&
              (!validationInfo || validationInfo.isValid
                ? "ring-green"
                : "ring-red-dark")
            } focus:outline-none focus:ring-2`}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            onChange={(e) => props.setText(e.target.value)}
          />
          {props.value.length > 0 && (
            <button
              className="absolute inset-y-0 right-[0.8rem] flex items-center"
              onClick={resetInput}
            >
              <Image src="/cancel.png" alt="취소" width="24" height="24" />
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center pt-[0.8rem] text-xs">
        <span
          className={`${
            onValidAction &&
            (validationInfo && validationInfo.isValid
              ? "text-green"
              : "text-red-dark")
          }`}
        >
          {onValidAction && validationInfo?.text}
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
