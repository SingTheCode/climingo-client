"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useGetJjikboulDetailQuery } from "@/api/hooks/jjikboul";
import useJjikboul from "@/hooks/jjikboul/useJjikboul";
import useJjikboulUI from "@/hooks/jjikboul/useJjikboulUI";
import { JjikboulDetail } from "@/types/jjikboul";

import Avatar from "@/components/common/Avatar";
import Loading from "@/components/common/Loading";

export default function JjikboulShareDetail() {
  const params = useParams();
  const jjikboulId = params?.jjikboulId as string;

  const { data, isLoading, isError } = useGetJjikboulDetailQuery(jjikboulId);
  const { getShareUrl, validateJjikboulData } = useJjikboul();
  const { handleShare, handleSaveAsImage } = useJjikboulUI();

  const handleShareClick = () => {
    if (data) {
      const isValid = validateJjikboulData(data);

      if (isValid) {
        const url = getShareUrl();
        handleShare(url);
      }
    }
  };

  const handleSaveClick = () => {
    handleSaveAsImage();
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
      className="w-full max-w-[390px] h-[824px] mx-auto bg-ink relative flex flex-col"
      style={{ maxWidth: "390px" }}
    >
      {/* 메인 이미지 영역 */}
      <MainImageSection />

      {/* 유저 정보 및 설명 영역 */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-[15px]">
        <UserInfoBottomSection data={data} />
        <DescriptionSection description={data.jjikboul.description} />
      </div>

      {/* 액션 버튼 영역 */}
      <ActionButtonsSection
        onShareClick={handleShareClick}
        onSaveClick={handleSaveClick}
      />
    </div>
  );
}

function MainImageSection() {
  return (
    <div className="relative px-5 pt-5">
      <div className="relative w-[340px] h-[594px] mx-auto rounded-[19px] overflow-hidden">
        {/* 찍볼 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-testid="jjikboul-problem-image"
          style={{
            backgroundImage: 'url("/assets/climbing-background.jpg")',
          }}
        />
      </div>
    </div>
  );
}

function UserInfoBottomSection({ data }: { data: JjikboulDetail }) {
  return (
    <div className="flex items-center gap-[12px]">
      <div className="w-[38px] h-[38px] bg-yellow-lightest rounded-[19px] overflow-hidden">
        <Avatar
          size="base"
          src={data.memberInfo.profileUrl || "/images/default-profile.jpg"}
          alt={data.memberInfo.nickname}
        />
      </div>
      <div className="text-white font-bold text-[15px] leading-[1.19em]">
        {data.memberInfo.nickname}
      </div>
    </div>
  );
}

function DescriptionSection({ description }: { description: string }) {
  return (
    <div className="">
      <p className="text-white text-sm font-medium leading-[1.19em]">
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
    <div className="absolute bottom-0 left-0 w-full px-5 py-[18px] flex justify-between">
      {/* 공유하기 버튼 */}
      <button
        onClick={onShareClick}
        className="w-[170px] h-12 bg-primary rounded-[10px] flex items-center justify-center gap-[15px] text-white font-bold text-base"
        style={{ padding: "18px 57px 18px 47px" }}
      >
        <div data-testid="share-icon">
          <Image
            src="/icons/icon-share.svg"
            alt="공유"
            width={40}
            height={40}
          />
        </div>
        공유하기
      </button>

      {/* 저장하기 버튼 */}
      <button
        onClick={onSaveClick}
        className="w-[170px] h-12 bg-primary rounded-[10px] flex items-center justify-center gap-[15px] text-white font-bold text-base"
        style={{ padding: "18px 47px 18px 57px" }}
      >
        <div data-testid="download-icon">
          <Image
            src="/icons/icon-download.svg"
            alt="다운로드"
            width={40}
            height={40}
          />
        </div>
        저장하기
      </button>
    </div>
  );
}
