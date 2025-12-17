"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { RecordDetail } from "@/domains/record/components/RecordDetail";
import { useRecordActions } from "@/domains/record/hooks/useRecordActions";
import { AsyncBoundary } from "@/lib/async";
import Layout from "@/components/Layout";
import NavigationHeader from "@/components/NavigationHeader";
import Avatar from "@/components/Avatar";
import LevelIcon from "@/domains/place/components/LevelIcon";
import LayerPopup from "@/components/popup/LayerPopup";
import ReportForm from "@/domains/record/components/ReportForm";
import Loading from "@/components/Loading";
import useUserStore from "@/store/user";
import { fromNowFormat } from "@/utils/common";
import type { LevelColor } from "@/domains/place/types/entity";

function RecordDetailContent() {
  const params = useParams();
  const recordId = Number(params?.recordId);

  return (
    <RecordDetail recordId={recordId}>
      <RecordDetail.Actions>
        {({ recordId, memberId }) => (
          <NavigationHeader
            rightElement={
              <RecordActionMenu recordId={recordId} memberId={memberId} />
            }
          />
        )}
      </RecordDetail.Actions>

      <div className="w-full h-[80%] flex flex-col">
        <RecordDetail.Info>
          {({ record }) => (
            <>
              <UserTemplate
                memberInfo={record.memberInfo}
                createTime={record.record.createTime}
              />
              <RecordTemplate
                record={record.record}
                gym={record.gym}
                level={record.level}
              />
            </>
          )}
        </RecordDetail.Info>
      </div>
    </RecordDetail>
  );
}

function RecordActionMenu({
  recordId,
  memberId,
}: {
  recordId: number;
  memberId: number | null;
}) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { deleteRecord } = useRecordActions();

  const isDeletable = user?.memberId === memberId;
  const showMenuButton = isDeletable || user;

  const handleDeleteButtonClick = async () => {
    if (confirm("정말 기록을 삭제할까요?")) {
      deleteRecord(recordId);
      alert("기록이 삭제되었습니다.");
      router.push("/");
    }
  };

  if (!showMenuButton) {
    return null;
  }

  return (
    <>
      <Menu>
        <MenuButton>
          <Image
            src="/icons/icon-hamburger.svg"
            alt="메뉴"
            width={24}
            height={24}
          />
        </MenuButton>
        <MenuItems className="absolute right-4 top-12 bg-white shadow-lg rounded-lg p-2 z-10">
          {isDeletable && (
            <MenuItem>
              <button
                onClick={handleDeleteButtonClick}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                삭제
              </button>
            </MenuItem>
          )}
          {user && (
            <MenuItem>
              <button
                onClick={() => setIsReportOpen(true)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                신고
              </button>
            </MenuItem>
          )}
        </MenuItems>
      </Menu>

      <LayerPopup open={isReportOpen} onClose={() => setIsReportOpen(false)}>
        <ReportForm
          recordId={String(recordId)}
          onSubmitSuccess={() => setIsReportOpen(false)}
        />
      </LayerPopup>
    </>
  );
}

function UserTemplate({
  memberInfo,
  createTime,
}: {
  memberInfo: { profileImageUrl?: string | null; nickname?: string } | null;
  createTime: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar
        src={memberInfo?.profileImageUrl || ""}
        size="lg"
        alt={memberInfo?.nickname || "익명"}
      />
      <div>
        <p className="font-semibold">{memberInfo?.nickname || "익명"}</p>
        <p className="text-sm text-gray-500">{fromNowFormat(createTime)}</p>
      </div>
    </div>
  );
}

function RecordTemplate({
  record,
  gym,
  level,
}: {
  record: { videoUrl: string; thumbnailUrl: string; description?: string };
  gym: { gymName: string };
  level: { colorNameKo: string; colorNameEn: string };
}) {
  return (
    <div className="flex-1 overflow-auto">
      <video
        src={record.videoUrl}
        controls
        className="w-full aspect-video"
        poster={record.thumbnailUrl}
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <LevelIcon color={level.colorNameEn as LevelColor} />
          <span className="font-semibold">{gym.gymName}</span>
          <span className="text-gray-600">{level.colorNameKo}</span>
        </div>
        {record.description && (
          <p className="text-gray-700 mt-2">{record.description}</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Layout containHeader>
      <AsyncBoundary
        pendingFallback={
          <div className="h-full flex justify-center items-center">
            <Loading />
          </div>
        }
        rejectedFallback={() => (
          <div className="p-4 text-center text-red-500">
            기록을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      >
        <RecordDetailContent />
      </AsyncBoundary>
    </Layout>
  );
}
