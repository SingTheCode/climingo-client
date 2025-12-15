"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useEditProfile } from "@/domains/profile/hooks/useEditProfile";

interface EditProfileContextValue {
  nickname: string;
  setNickname: (value: string) => void;
  isValid: boolean;
  setIsValid: (value: boolean) => void;
  handleSubmit: (memberId: number) => Promise<void>;
  isEditing: boolean;
}

const EditProfileContext = createContext<EditProfileContextValue | null>(null);

const useEditProfileContext = () => {
  const context = useContext(EditProfileContext);
  if (!context) {
    throw new Error("EditProfile 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

interface EditProfileProps {
  initialNickname: string;
  children: ReactNode;
}

export const EditProfile = ({
  initialNickname,
  children,
}: EditProfileProps) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [isValid, setIsValid] = useState(true);
  const { editNickname, isEditing } = useEditProfile();

  const handleSubmit = async (memberId: number) => {
    if (!isValid || nickname === "") {
      alert("닉네임이 유효하지 않습니다.");
      return;
    }

    try {
      await editNickname({ memberId, nickname });
      alert("닉네임이 변경되었습니다.");
    } catch (error) {
      alert("닉네임 변경에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <EditProfileContext.Provider
      value={{
        nickname,
        setNickname,
        isValid,
        setIsValid,
        handleSubmit,
        isEditing,
      }}
    >
      {children}
    </EditProfileContext.Provider>
  );
};

interface EditProfileInputProps {
  maxLength?: number;
  rules?: Array<(value: string) => boolean | string>;
}

const Input = ({ maxLength = 8, rules }: EditProfileInputProps) => {
  const { nickname, setNickname, setIsValid } = useEditProfileContext();

  return (
    <input
      type="text"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      maxLength={maxLength}
      className="w-full h-[4.8rem] px-[1.6rem] border border-gray-300 rounded-lg"
      onBlur={() => {
        if (rules) {
          const valid = rules.every((rule) => rule(nickname) === true);
          setIsValid(valid);
        }
      }}
    />
  );
};

EditProfile.Input = Input;

interface EditProfileSubmitProps {
  memberId: number;
  children: ReactNode;
}

const Submit = ({ memberId, children }: EditProfileSubmitProps) => {
  const { handleSubmit, isEditing } = useEditProfileContext();

  return (
    <button
      onClick={() => handleSubmit(memberId)}
      disabled={isEditing}
      className="w-full h-[5.6rem] bg-primary text-white rounded-lg disabled:opacity-50"
    >
      {children}
    </button>
  );
};

EditProfile.Submit = Submit;
