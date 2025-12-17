"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useJjikboul } from "@/domains/jjikboul/hooks/useJjikboul";
import { useJjikboulUI } from "@/domains/jjikboul/hooks/useJjikboulUI";
import { AsyncBoundary } from "@/lib/async";
import useImageDownload from "@/domains/jjikboul/hooks/useImageDownload";
import useAppScheme from "@/domains/jjikboul/hooks/useAppScheme";
import Loading from "@/components/Loading";
import Avatar from "@/components/Avatar";
import { useJjikboulDetailQuery } from "@/domains/jjikboul/hooks/useJjikboulDetailQuery";

function JjikboulDetailContent() {
  const params = useParams();
  const jjikboulId = params?.jjikboulId as string;
  const { data } = useJjikboulDetailQuery(jjikboulId);

  const { getShareUrl, validateJjikboulData } = useJjikboul();
  const { copyToClipboard } = useJjikboulUI();
  const { share, isNativeShareAvailable } = useAppScheme();
  const { downloadImage } = useImageDownload();

  const handleShareClick = async () => {
    if (data) {
      const isValid = validateJjikboulData(data);

      if (isValid) {
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
      }
    }
  };

  const handleSaveClick = () => {
    if (data?.jjikboul?.problemUrl) {
      downloadImage(data.jjikboul.problemUrl);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen w-full bg-[#292929] flex items-center justify-center">
      <div
        id="jjikboul-share-container"
        data-testid="jjikboul-share-container"
        className="w-full max-w-[40rem] h-[82rem] relative flex flex-col"
      >
        {/* 메인 이미지 영역 */}
        <div className="relative flex-1 w-full">
          {data.jjikboul?.problemUrl && (
            <Image
              src={data.jjikboul.problemUrl}
              alt="찍볼 문제"
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        {/* 하단 정보 영역 */}
        <div className="bg-white rounded-t-[2rem] p-[2rem] space-y-[1.5rem]">
          {/* 회원 정보 */}
          <div className="flex items-center gap-[1rem]">
            {data.memberInfo?.profileUrl && (
              <Avatar
                src={data.memberInfo.profileUrl}
                alt={data.memberInfo.nickname}
                size="base"
              />
            )}
            <p className="text-base font-medium">{data.memberInfo?.nickname}</p>
          </div>

          {/* 암장 정보 */}
          <div>
            <p className="text-base font-medium">{data.gym?.name}</p>
          </div>

          {/* 난이도 */}
          <div>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: data.level?.color }}
            >
              {data.level?.name}
            </span>
          </div>

          {/* 문제 설명 */}
          {data.jjikboul?.description && (
            <p className="text-sm text-gray-700">{data.jjikboul.description}</p>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-[1rem] pt-[1rem]">
            <button
              onClick={handleShareClick}
              className="flex-1 h-[5.6rem] bg-primary text-white rounded-lg flex items-center justify-center gap-[0.5rem]"
            >
              <Image
                src="/icons/icon-share.svg"
                alt="공유"
                width={20}
                height={20}
              />
              <span>공유하기</span>
            </button>
            <button
              onClick={handleSaveClick}
              className="flex-1 h-[5.6rem] border border-gray-300 rounded-lg flex items-center justify-center gap-[0.5rem]"
            >
              <Image
                src="/icons/icon-download.svg"
                alt="저장"
                width={20}
                height={20}
              />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JjikboulPage() {
  return (
    <AsyncBoundary
      pendingFallback={
        <div className="min-h-screen w-full bg-[#292929] flex items-center justify-center">
          <div className="w-full max-w-[40rem] mx-auto flex items-center justify-center h-[82rem]">
            <Loading />
          </div>
        </div>
      }
      rejectedFallback={() => (
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
      )}
    >
      <JjikboulDetailContent />
    </AsyncBoundary>
  );
}
