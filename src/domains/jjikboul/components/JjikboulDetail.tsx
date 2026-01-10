"use client";

import Image from "next/image";
import { createContext, useContext, type ReactNode } from "react";

import type { JjikboulDetail as JjikboulDetailType } from "@/domains/jjikboul/types/entity";

import useAppScheme from "@/domains/jjikboul/hooks/useAppScheme";
import useImageDownload from "@/domains/jjikboul/hooks/useImageDownload";
import { useJjikboul } from "@/domains/jjikboul/hooks/useJjikboul";
import { useJjikboulDetailQuery } from "@/domains/jjikboul/hooks/useJjikboulDetailQuery";
import { useJjikboulUI } from "@/domains/jjikboul/hooks/useJjikboulUI";

import Avatar from "@/components/Avatar";

interface JjikboulDetailContextValue {
  jjikboulDetail: JjikboulDetailType;
  onShare: () => Promise<void>;
  onSave: () => void;
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

  const { getShareUrl, validateJjikboulData } = useJjikboul();
  const { copyToClipboard } = useJjikboulUI();
  const { share, isNativeShareAvailable } = useAppScheme();
  const { downloadImage } = useImageDownload();

  const onShare = async () => {
    const isValid = validateJjikboulData(jjikboulDetail);
    if (!isValid) return;

    const url = getShareUrl();

    if (isNativeShareAvailable()) {
      share({
        url,
        title: "찍볼 공유",
        text: "찍볼을 확인해보세요!",
      });
    } else {
      try {
        await copyToClipboard(url);
        alert("링크가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("공유 링크 복사 에러:", error);
        alert("공유 링크 복사에 실패했습니다.");
      }
    }
  };

  const onSave = () => {
    if (jjikboulDetail.jjikboul?.problemUrl) {
      downloadImage(jjikboulDetail.jjikboul.problemUrl);
    }
  };

  return (
    <JjikboulDetailContext.Provider value={{ jjikboulDetail, onShare, onSave }}>
      {children}
    </JjikboulDetailContext.Provider>
  );
};

// 문제 이미지 (fill 모드)
const ProblemImage = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();

  if (!jjikboulDetail.jjikboul?.problemUrl) {
    return null;
  }

  return (
    <Image
      src={jjikboulDetail.jjikboul.problemUrl}
      alt="찍볼 문제"
      fill
      className="object-contain"
      priority
    />
  );
};

JjikboulDetail.ProblemImage = ProblemImage;

// 회원 정보 (아바타 + 닉네임)
const MemberInfo = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();

  return (
    <div className="flex items-center gap-[1rem]">
      {jjikboulDetail.memberInfo?.profileUrl && (
        <Avatar
          src={jjikboulDetail.memberInfo.profileUrl}
          alt={jjikboulDetail.memberInfo.nickname}
          size="base"
        />
      )}
      <p className="text-base font-medium">
        {jjikboulDetail.memberInfo?.nickname}
      </p>
    </div>
  );
};

JjikboulDetail.MemberInfo = MemberInfo;

// 암장 이름
const GymName = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return <p className="text-base font-medium">{jjikboulDetail.gym?.name}</p>;
};

JjikboulDetail.GymName = GymName;

// 난이도
const LevelBadge = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();
  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium"
      style={{ backgroundColor: jjikboulDetail.level?.color }}
    >
      {jjikboulDetail.level?.name}
    </span>
  );
};

JjikboulDetail.LevelBadge = LevelBadge;

// 문제 설명
const Description = () => {
  const { jjikboulDetail } = useJjikboulDetailContext();

  if (!jjikboulDetail.jjikboul?.description) {
    return null;
  }

  return (
    <p className="text-sm text-gray-700">
      {jjikboulDetail.jjikboul.description}
    </p>
  );
};

JjikboulDetail.Description = Description;

// 액션 버튼 (render props)
interface ActionsProps {
  children: (props: { onShare: () => Promise<void>; onSave: () => void }) => ReactNode;
}

const Actions = ({ children }: ActionsProps) => {
  const { onShare, onSave } = useJjikboulDetailContext();
  return <>{children({ onShare, onSave })}</>;
};

JjikboulDetail.Actions = Actions;
