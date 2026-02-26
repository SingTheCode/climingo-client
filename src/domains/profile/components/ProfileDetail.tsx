"use client";

import Image from "next/image";
import { createContext, useContext, type ReactNode } from "react";

import type { Profile } from "@/domains/profile/types/entity";

import { useEditProfileDetailMutation } from "@/domains/profile/hooks/useEditProfileDetailMutation";
import { useProfileDetail } from "@/domains/profile/hooks/useProfileDetail";

import Avatar from "@/components/Avatar";

interface ProfileDetailContextValue {
  profile: Profile;
  weight: number | undefined;
  height: number | undefined;
  armSpan: number | undefined;
  setWeight: (value: number | undefined) => void;
  setHeight: (value: number | undefined) => void;
  setArmSpan: (value: number | undefined) => void;
  handleSave: () => void;
  isSaving: boolean;
}

const ProfileDetailContext = createContext<ProfileDetailContextValue | null>(
  null
);

const useProfileDetailContext = () => {
  const context = useContext(ProfileDetailContext);
  if (!context) {
    throw new Error("ProfileDetail 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

interface ProfileDetailProps {
  profile: Profile;
  children: ReactNode;
}

export const ProfileDetail = ({ profile, children }: ProfileDetailProps) => {
  const { weight, height, armSpan, setWeight, setHeight, setArmSpan } =
    useProfileDetail(profile);
  const { editProfile, isEditing } = useEditProfileDetailMutation();

  const handleSave = () => {
    editProfile({
      memberId: profile.memberId,
      weight,
      height,
      armSpan,
    });
  };

  return (
    <ProfileDetailContext.Provider
      value={{
        profile,
        weight,
        height,
        armSpan,
        setWeight,
        setHeight,
        setArmSpan,
        handleSave,
        isSaving: isEditing,
      }}
    >
      <section className="flex flex-col p-4">{children}</section>
    </ProfileDetailContext.Provider>
  );
};

const Header = () => {
  const { profile } = useProfileDetailContext();

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar size="xl" src={profile.profileUrl} alt={profile.nickname} />
      <div className="flex items-center mt-4">
        <span className="text-xl font-bold">{profile.nickname}</span>
      </div>
    </div>
  );
};

ProfileDetail.Header = Header;

const Email = () => {
  const { profile } = useProfileDetailContext();

  return (
    <div>
      <label className="text-sm font-medium text-shadow-dark">이메일</label>
      <div className="flex items-center mt-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            profile.providerType === "kakao" ? "bg-[#FFEB00]" : "bg-black"
          }`}
        >
          <Image
            src={
              profile.providerType === "kakao"
                ? "/assets/kakao.svg"
                : "/assets/apple.svg"
            }
            alt={profile.providerType}
            width={24}
            height={24}
          />
        </div>
        <span className="ml-3 font-medium">{profile.email}</span>
      </div>
    </div>
  );
};

ProfileDetail.Email = Email;

interface NumberInputProps {
  label: string;
  field: "weight" | "height" | "armSpan";
  unit: string;
}

const NumberInput = ({ label, field, unit }: NumberInputProps) => {
  const context = useProfileDetailContext();
  const value = context[field];
  const setValue =
    field === "weight"
      ? context.setWeight
      : field === "height"
        ? context.setHeight
        : context.setArmSpan;

  return (
    <div>
      <label className="text-sm font-medium text-shadow-dark">{label}</label>
      <div className="relative mt-2">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            setValue(val === "" ? undefined : Number(val));
          }}
          placeholder="0"
          className="w-full h-[4.4rem] bg-shadow-lighter rounded-[0.8rem] py-[1rem] pl-[1.6rem] pr-[4.8rem] text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="absolute inset-y-0 right-4 flex items-center text-shadow-dark">
          {unit}
        </span>
      </div>
    </div>
  );
};

ProfileDetail.NumberInput = NumberInput;

const Form = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};

ProfileDetail.Form = Form;

const SaveButton = ({ children }: { children: ReactNode }) => {
  const { handleSave, isSaving } = useProfileDetailContext();

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="w-full h-[5.6rem] bg-primary text-white rounded-lg disabled:opacity-50"
    >
      {children}
    </button>
  );
};

ProfileDetail.SaveButton = SaveButton;

const Footer = ({ children }: { children: ReactNode }) => {
  return <footer className="pt-8 pb-4 mt-8">{children}</footer>;
};

ProfileDetail.Footer = Footer;
