"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signUpApi } from "@/api/modules/user";
import { useUserActions, useUserValue } from "@/store/user";
import useAuthSession from "@/hooks/useAuthStorage";

import InputText from "@/components/common/InputText";
import BottomActionButton from "@/components/common/BottomActionButton";

export default function SignUpForm() {
  const router = useRouter();

  const user = useUserValue();
  const { setUser } = useUserActions();

  const authSession = useAuthSession();

  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(true);

  const checkValid = (isValid: boolean) => {
    setIsValid(isValid);
  };

  const signUp = async () => {
    if (!isValid || nickname === "") {
      alert("닉네임이 유효하지 않습니다. 다시 입력해주세요.");
      setNickname("");
      return;
    }

    try {
      if (user) {
        const data = await signUpApi({ ...user, nickname });
        setUser(data);
        authSession.set(data);
        router.replace("/");
      }
    } catch {
      alert("로그인에 실패했습니다.");
      router.replace("/signIn");
    }
  };

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user]);

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
      <BottomActionButton onClick={signUp}>완료</BottomActionButton>
    </div>
  );
}
