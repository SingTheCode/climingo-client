"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useJjikboulDetailQuery } from "@/domains/jjikboul/hooks/useJjikboulDetailQuery";
import type { JjikboulDetail as JjikboulDetailType } from "@/domains/jjikboul/types/entity";
import Image from "next/image";

interface JjikboulDetailContextValue {
  jjikboulDetail: JjikboulDetailType;
}

const JjikboulDetailContext = createContext<JjikboulDetailContextValue | null>(
  null
);

const useJjikboulDetailContext = () => {
  const context = useContext(JjikboulDetailContext);
  if (!context) {
    throw new Error("JjikboulDetail 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

interface JjikboulDetailProps {
  id: string;
  children: ReactNode;
}

export const JjikboulDetail = ({ id, children }: JjikboulDetailProps) => {
  const { data: jjikboulDetail } = useJjikboulDetailQuery(id);

  return (
    <JjikboulDetailContext.Provider value={{ jjikboulDetail }}>
      {children}
    </JjikboulDetailContext.Provider>
  );
};

const ProblemType = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <p className="text-lg font-bold">{jjikboulDetail.jjikboul.problemType}</p>
  );
};

JjikboulDetail.ProblemType = ProblemType;

const Description = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <p className="text-sm text-gray-700">
      {jjikboulDetail.jjikboul.description}
    </p>
  );
};

JjikboulDetail.Description = Description;

const ProblemUrl = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();

  if (!jjikboulDetail.jjikboul.problemUrl) {
    return null;
  }

  return (
    <Image
      src={jjikboulDetail.jjikboul.problemUrl}
      alt="문제 이미지"
      className="w-full rounded-lg"
    />
  );
};

JjikboulDetail.ProblemUrl = ProblemUrl;

const GymName = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return <p className="text-base font-medium">{jjikboulDetail.gym.name}</p>;
};

JjikboulDetail.GymName = GymName;

const GymAddress = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return <p className="text-sm text-gray-600">{jjikboulDetail.gym.address}</p>;
};

JjikboulDetail.GymAddress = GymAddress;

const LevelName = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium"
      style={{ backgroundColor: jjikboulDetail.level.color }}
    >
      {jjikboulDetail.level.name}
    </span>
  );
};

JjikboulDetail.LevelName = LevelName;

const MemberNickname = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <p className="text-base font-medium">
      {jjikboulDetail.memberInfo.nickname}
    </p>
  );
};

JjikboulDetail.MemberNickname = MemberNickname;

const MemberAvatar = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <Image
      className="rounded-full w-[4rem] h-[4rem]"
      src={jjikboulDetail.memberInfo.profileUrl}
      alt={jjikboulDetail.memberInfo.nickname}
    />
  );
};

JjikboulDetail.MemberAvatar = MemberAvatar;
