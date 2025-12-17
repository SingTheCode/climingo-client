"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/domains/auth/hooks/useSignUp";
import useUserStore from "@/store/user";
import type { MemberInfo } from "@/domains/auth/types/entity";

interface SignUpContextValue {
  nickname: string;
  setNickname: (value: string) => void;
  isValid: boolean;
  setIsValid: (value: boolean) => void;
  handleSubmit: () => Promise<void>;
}

const SignUpContext = createContext<SignUpContextValue | null>(null);

const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("SignUp 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

export const SignUp = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user) as MemberInfo;
  const { signUp } = useSignUp();

  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async () => {
    if (!isValid || nickname === "") {
      alert("닉네임이 유효하지 않습니다. 다시 입력해주세요.");
      setNickname("");
      return;
    }

    try {
      await signUp({
        nickname,
        profileUrl: user.profileUrl || "",
        authId: user.authId || "",
        email: user.email || "",
        providerType: user.providerType || "kakao",
        providerToken: "",
      });
      router.replace("/");
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
    <SignUpContext.Provider
      value={{ nickname, setNickname, isValid, setIsValid, handleSubmit }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

const Form = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex flex-col items-start pt-[2rem]">{children}</div>
  );
};

SignUp.Form = Form;

const Label = ({ children }: { children: ReactNode }) => {
  return <span>{children}</span>;
};

SignUp.Label = Label;

interface SignUpInputProps {
  maxLength?: number;
  rules?: Array<(value: string) => boolean | string>;
}

const Input = ({ maxLength = 8, rules }: SignUpInputProps) => {
  const { nickname, setNickname, setIsValid } = useSignUpContext();

  return (
    <input
      type="text"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      maxLength={maxLength}
      className="w-full h-[4.8rem] px-[1.6rem] mt-[0.8rem] border border-gray-300 rounded-lg"
      onBlur={() => {
        if (rules) {
          const valid = rules.every((rule) => rule(nickname) === true);
          setIsValid(valid);
        }
      }}
    />
  );
};

SignUp.Input = Input;

const Submit = ({ children }: { children: ReactNode }) => {
  const { handleSubmit } = useSignUpContext();

  return (
    <button
      onClick={handleSubmit}
      className="w-full h-[5.6rem] bg-primary text-white rounded-lg mt-auto"
    >
      {children}
    </button>
  );
};

SignUp.Submit = Submit;
