"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMyProfileQuery } from "@/domains/profile/hooks/useMyProfileQuery";
import type { Profile } from "@/domains/profile/types/entity";
import Image from "next/image";

interface MyProfileContextValue {
  profile: Profile;
}

const MyProfileContext = createContext<MyProfileContextValue | null>(null);

const useMyProfileContext = () => {
  const context = useContext(MyProfileContext);
  if (!context) {
    throw new Error("MyProfile 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

export const MyProfile = ({ children }: { children: ReactNode }) => {
  const { data: profile } = useMyProfileQuery();

  return (
    <MyProfileContext.Provider value={{ profile }}>
      {children}
    </MyProfileContext.Provider>
  );
};

const Avatar = () => {
  const { profile } = useMyProfileContext();

  return (
    <Image
      className="rounded-full w-[6rem] h-[6rem]"
      src={profile.profileUrl}
      alt={profile.nickname}
    />
  );
};

MyProfile.Avatar = Avatar;

const Nickname = () => {
  const { profile } = useMyProfileContext();
  return <p className="text-xl font-bold line-clamp-2">{profile.nickname}</p>;
};

MyProfile.Nickname = Nickname;

const Email = () => {
  const { profile } = useMyProfileContext();
  return <p className="text-sm text-gray-600">{profile.email}</p>;
};

MyProfile.Email = Email;

const Provider = () => {
  const { profile } = useMyProfileContext();
  const providerText = profile.providerType === "kakao" ? "카카오" : "Apple";
  return <p className="text-sm text-gray-600">{providerText}</p>;
};

MyProfile.Provider = Provider;
