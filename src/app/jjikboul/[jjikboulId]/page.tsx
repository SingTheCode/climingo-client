"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { AsyncBoundary } from "@/lib/async";

import Loading from "@/components/Loading";

import { JjikboulDetail } from "@/domains/jjikboul/components/JjikboulDetail";

function JjikboulDetailContent() {
  const params = useParams();
  const jjikboulId = params?.jjikboulId as string;

  return (
    <JjikboulDetail id={jjikboulId}>
      <div className="min-h-screen w-full bg-ink flex items-center justify-center">
        <div
          id="jjikboul-share-container"
          data-testid="jjikboul-share-container"
          className="w-full max-w-[40rem] h-[82rem] relative flex flex-col"
        >
          {/* 메인 이미지 영역 */}
          <div className="relative flex-1 w-full">
            <JjikboulDetail.ProblemImage />
          </div>

          {/* 하단 정보 영역 */}
          <div className="bg-white rounded-t-[2rem] p-[2rem] space-y-[1.5rem]">
            <JjikboulDetail.MemberInfo />

            <div>
              <JjikboulDetail.GymName />
            </div>

            <div>
              <JjikboulDetail.LevelBadge />
            </div>

            <JjikboulDetail.Description />

            <JjikboulDetail.Actions>
              {({ onShare, onSave }) => (
                <div className="flex gap-[1rem] pt-[1rem]">
                  <button
                    onClick={onShare}
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
                    onClick={onSave}
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
              )}
            </JjikboulDetail.Actions>
          </div>
        </div>
      </div>
    </JjikboulDetail>
  );
}

export default function JjikboulPage() {
  return (
    <AsyncBoundary
      pendingFallback={
        <div className="min-h-screen w-full bg-ink flex items-center justify-center">
          <div className="w-full max-w-[40rem] mx-auto flex items-center justify-center h-[82rem]">
            <Loading />
          </div>
        </div>
      }
      rejectedFallback={() => (
        <div className="min-h-screen w-full bg-ink flex items-center justify-center">
          <div className="w-full max-w-[40rem] mx-auto flex items-center justify-center h-[82rem]">
            <div className="text-center">
              <p className="text-white text-base font-medium">
                문제를 불러올 수 없습니다.
              </p>
              <p className="text-shadow text-sm mt-2">
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
