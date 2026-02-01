"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Profile } from "@/domains/profile/types/entity";

import { useProfileQuery } from "@/domains/profile/hooks/useProfileQuery";

import Avatar from "@/components/Avatar";

interface MyProfileContextValue {
  profile: Profile | undefined;
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
  const { data: profile } = useProfileQuery();

  return (
    <MyProfileContext.Provider value={{ profile }}>
      {children}
    </MyProfileContext.Provider>
  );
};

const MyAvatar = () => {
  const { profile } = useMyProfileContext();

  if (!profile) return null;

  return <Avatar size="lg" src={profile.profileUrl} alt={profile.nickname} />;
};

MyProfile.MyAvatar = MyAvatar;

const Nickname = () => {
  const { profile } = useMyProfileContext();
  if (!profile) return null;
  return <p className="text-xl font-bold line-clamp-2">{profile.nickname}</p>;
};

MyProfile.Nickname = Nickname;

const Email = () => {
  const { profile } = useMyProfileContext();
  if (!profile) return null;
  return <p className="text-sm text-gray-600">{profile.email}</p>;
};

MyProfile.Email = Email;

const Provider = () => {
  const { profile } = useMyProfileContext();
  if (!profile) return null;
  const providerText = profile.providerType === "kakao" ? "카카오" : "Apple";
  return <p className="text-sm text-gray-600">{providerText}</p>;
};

MyProfile.Provider = Provider;
