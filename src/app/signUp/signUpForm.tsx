"use client";

import { useState } from "react";
import InputText from "@/components/common/InputText";

export default function SignUpForm() {
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(true);

  const checkValid = (isValid: boolean) => {
    setIsValid(isValid);
  };
  const signUp = () => {
    if (!isValid) {
      alert("닉네임이 유효하지 않습니다. 다시 입력해주세요.");
      setNickname("");
      return;
    }
    alert("success");
  };

  return (
    <div className="w-full flex flex-col items-start pt-[2rem]">
      <span>닉네임</span>
      <InputText
        value={nickname}
        setText={setNickname}
        maxLength={8}
        rules={[
          (value) =>
            /^[a-zA-Z0-9가-힣]+$/.test(value) ||
            "띄어쓰기 없이 영문,숫자,한글만 가능해요",
          (value) =>
            (2 <= value.length && value.length <= 8) ||
            "2글자 이상 8글자 이하만 가능해요",
        ]}
        checkValid={checkValid}
      />
      <button onClick={signUp}>완료</button>
    </div>
  );
}
