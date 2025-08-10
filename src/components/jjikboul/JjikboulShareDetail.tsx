"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import useJjikboul from "@/hooks/jjikboul/useJjikboul";
import { JjikboulDetail } from "@/types/jjikboul";

import Avatar from "@/components/common/Avatar";
import Loading from "@/components/common/Loading";

export default function JjikboulShareDetail() {
  const params = useParams();
  const jjikboulId = params?.jjikboulId as string;

  const {
    jjikboul: data,
    isLoading,
    isError,
    shareCurrentJjikboul,
    saveAsImage,
  } = useJjikboul(jjikboulId);

  const handleShareClick = () => {
    shareCurrentJjikboul();
  };

  const handleSaveClick = () => {
    saveAsImage();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[390px] mx-auto bg-white flex items-center justify-center h-[824px]">
        <div data-testid="loading-spinner">
          <Loading />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[390px] mx-auto bg-white flex items-center justify-center h-[824px]">
        <div className="text-center">
          <p className="text-[#292929] text-base font-medium">
            문제를 불러올 수 없습니다.
          </p>
          <p className="text-[#b3b3b3] text-sm mt-2">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      id="jjikboul-share-container"
      data-testid="jjikboul-share-container"
      className="w-full max-w-[390px] mx-auto bg-white"
      style={{ maxWidth: "390px" }}
    >
      {/* 메인 이미지 영역 */}
      <MainImageSection data={data} />

      {/* 설명 텍스트 영역 */}
      <DescriptionSection description={data.jjikboul.description} />

      {/* 액션 버튼 영역 */}
      <ActionButtonsSection
        onShareClick={handleShareClick}
        onSaveClick={handleSaveClick}
      />
    </div>
  );
}

function MainImageSection({ data }: { data: JjikboulDetail }) {
  return (
    <div className="relative w-full h-[674px] bg-[#292929] overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        data-testid="jjikboul-problem-image"
        style={{
          backgroundImage: 'url("/assets/climbing-background.jpg")',
          opacity: 0.65,
        }}
      />

      {/* 사용자 정보 및 암장 정보 */}
      <UserInfoSection data={data} />

      {/* 브랜드 로고 */}
      <BrandLogoSection />
    </div>
  );
}

function UserInfoSection({ data }: { data: JjikboulDetail }) {
  return (
    <div className="absolute top-5 left-6 flex items-start gap-3">
      {/* 프로필 정보 */}
      <div className="flex items-center gap-3">
        <Avatar
          size="sm"
          src={data.memberInfo.profileUrl || "/images/default-profile.jpg"}
          alt={data.memberInfo.nickname}
        />
        <div className="text-white font-bold text-base">
          {data.memberInfo.nickname}
        </div>
      </div>

      {/* 암장 및 난이도 정보 */}
      <div className="ml-auto">
        <div className="bg-[#fafafa]/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <Image
            src="/icons/icon-location.svg"
            alt="location"
            width={20}
            height={20}
            className="text-[#292929]"
          />
          <span className="text-[#292929] font-bold text-sm">
            {data.gym.gymName}
          </span>
          <div
            className="w-3 h-3 rounded-full border border-[#b3b3b3]"
            data-testid="level-icon-orange"
            style={{ backgroundColor: "rgb(255, 179, 35)" }}
          />
        </div>
      </div>
    </div>
  );
}

function BrandLogoSection() {
  return (
    <div className="absolute bottom-5 right-6 flex items-center gap-2">
      <div className="w-7 h-7">
        <Image
          src="/assets/main-logo.svg"
          alt="클라밍고"
          width={28}
          height={28}
        />
      </div>
      <div className="text-white font-bold text-sm" data-testid="text-logo">
        클라밍고
      </div>
    </div>
  );
}

function DescriptionSection({ description }: { description: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[#292929] text-sm font-medium leading-4">
        {description}
      </p>
    </div>
  );
}

function ActionButtonsSection({
  onShareClick,
  onSaveClick,
}: {
  onShareClick: () => void;
  onSaveClick: () => void;
}) {
  return (
    <div className="px-5 pb-8 flex gap-4">
      {/* 공유하기 버튼 */}
      <button
        onClick={onShareClick}
        className="w-[170px] h-12 bg-[#ff5c75] rounded-[10px] flex items-center justify-center gap-2 text-white font-bold text-base"
      >
        <div data-testid="share-icon">
          <Image
            src="/icons/icon-share.svg"
            alt="공유"
            width={20}
            height={20}
          />
        </div>
        공유하기
      </button>

      {/* 저장하기 버튼 */}
      <button
        onClick={onSaveClick}
        className="w-[170px] h-12 bg-[#ff5c75] rounded-[10px] flex items-center justify-center gap-2 text-white font-bold text-base"
      >
        <div data-testid="download-icon">
          <Image
            src="/icons/icon-download.svg"
            alt="다운로드"
            width={20}
            height={20}
          />
        </div>
        저장하기
      </button>
    </div>
  );
}
