"use client";

import { Dispatch, SetStateAction } from "react";
import InputText from "./InputText";

interface ValidationRule {
  (value: string): true | string;
}

interface InputTextLegacyProps extends Partial<HTMLInputElement> {
  type?: "text" | "search";
  value: string;
  setText: Dispatch<SetStateAction<string>>;
  rules?: ValidationRule[];
  serverValidation?: {
    isValid: boolean;
    text: string;
  };
  checkValid?: (isValid: boolean) => void;
}

// 기존 사용법과 호환되는 래퍼 컴포넌트
export default function InputTextLegacy(props: InputTextLegacyProps) {
  const { value, setText, rules, serverValidation, checkValid, type, ...restProps } = props;

  return (
    <InputText
      rules={rules}
      serverValidation={serverValidation}
      onValidChange={checkValid}
    >
      <InputText.Field
        type={type}
        name={restProps.name}
        placeholder={restProps.placeholder}
        maxLength={restProps.maxLength}
      />
      <InputText.Validation maxLength={restProps.maxLength} />
    </InputText>
  );
}
