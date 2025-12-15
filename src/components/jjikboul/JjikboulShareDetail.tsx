"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useGetJjikboulDetailQuery } from "@/api/hooks/jjikboul";
import { useJjikboul } from "@/domains/jjikboul/hooks/useJjikboul";
import { useJjikboulUI } from "@/domains/jjikboul/hooks/useJjikboulUI";
import useImageDownload from "@/hooks/useImageDownload";
import useAppScheme from "@/hooks/useAppScheme";
import { JjikboulDetail } from "@/types/jjikboul";

import Avatar from "@/components/common/Avatar";
import Loading from "@/components/common/Loading";

export default function JjikboulShareDetail() {
  const params = useParams();
  const jjikboulId = params?.jjikboulId as string;

  const { data, isLoading, isError } = useGetJjikboulDetailQuery(jjikboulId);
  const { getShareUrl, validateJjikboulData } = useJjikboul();
  const { copyToClipboard } = useJjikboulUI();
  const { share, isNativeShareAvailable } = useAppScheme();
  const { downloadImage } = useImageDownload();

  const handleShareClick = async () => {
    if (data) {
      const isValid = validateJjikboulData(data);

      if (isValid) {
        const url = getShareUrl();

        // TODO: 진입점 추가되면 네이티브에서 앱스킴 테스트
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
      }
    }
  };

  const handleSaveClick = () => {
    if (data?.jjikboul?.problemUrl) {
      downloadImage(data.jjikboul.problemUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#292929] flex items-center justify-center">
        <div className="w-full max-w-[40rem] mx-auto flex items-center justify-center h-[82rem]">
          <div data-testid="loading-spinner">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full bg-[#292929] flex items-center justify-center">
        <div className="w-full max-w-[40rem] mx-auto flex items-center justify-center h-[82rem]">
          <div className="text-center">
            <p className="text-white text-base font-medium">
              문제를 불러올 수 없습니다.
            </p>
            <p className="text-[#b3b3b3] text-sm mt-2">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#292929] flex items-center justify-center">
      <div
        id="jjikboul-share-container"
        data-testid="jjikboul-share-container"
        className="w-full max-w-[40rem] h-[82rem] relative flex flex-col"
      >
        {/* 메인 이미지 영역 */}
        <MainImageSection data={data} />

        {/* 유저 정보 및 설명 영역 */}
        <div className="flex-1 px-[2rem] py-[2rem] flex flex-col gap-[1.5rem]">
          <UserInfoBottomSection data={data} />
          <DescriptionSection description={data.jjikboul.description} />
        </div>

        {/* 액션 버튼 영역 */}
        <ActionButtonsSection
          onShareClick={handleShareClick}
          onSaveClick={handleSaveClick}
        />
      </div>
    </div>
  );
}

function MainImageSection({ data }: { data: JjikboulDetail }) {
  return (
    <div className="relative px-[0.5rem] pt-[0.5rem]">
      <div className="relative w-[34rem] h-[60rem] mx-auto rounded-[2rem] overflow-hidden">
        {/* 찍볼 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-testid="jjikboul-problem-image"
          style={{
            backgroundImage: `url("${data.jjikboul.problemUrl}")`,
          }}
        />
      </div>
    </div>
  );
}

function UserInfoBottomSection({ data }: { data: JjikboulDetail }) {
  return (
    <div className="flex items-center gap-[1.2rem]">
      <div className="w-[4rem] h-[4rem] bg-yellow-lightest rounded-[2rem] overflow-hidden">
        <Avatar
          size="base"
          src={data.memberInfo.profileUrl || "/images/default-profile.jpg"}
          alt={data.memberInfo.nickname}
        />
      </div>
      <div className="text-white font-bold text-[1.5rem] leading-[1.2rem]">
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
    <div className="absolute bottom-0 left-0 w-full px-[2rem] py-[2rem] flex justify-center gap-[1rem]">
      {/* 공유하기 버튼 */}
      <button
        onClick={onShareClick}
        className="w-[18rem] h-[5rem] bg-primary rounded-[1rem] flex flex-row items-center justify-center gap-[1.5rem] text-white font-bold text-base"
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
        className="w-[18rem] h-[5rem] bg-primary rounded-[1rem] flex flex-row items-center justify-center gap-[2rem] text-white font-bold text-base"
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
