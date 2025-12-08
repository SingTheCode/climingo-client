"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { useRecordDetailQuery } from "@/domains/record/hooks/useRecordDetailQuery";
import useDeleteRecordMutation from "@/domains/record/hooks/useDeleteRecordMutation";
import { MemberInfo } from "@/domains/auth/types/auth";
import { Level, Gym, Record } from "@/domains/record/types/record";
import { fromNowFormat } from "@/shared/utils/common";
import useUserStore from "@/domains/auth/store/user";

import Avatar from "@/shared/components/Avatar";
import LevelIcon from "@/domains/record/components/LevelIcon";
import Layout from "@/shared/components/Layout";
import Loading from "@/shared/components/Loading";
import NavigationHeader from "@/shared/components/NavigationHeader";
import LayerPopup from "@/shared/components/LayerPopup";
import ReportForm from "@/domains/record/components/ReportForm";

export default function RecordDetail() {
  const params = useParams();
  const recordId = params?.recordId as string;

  const { data, isSuccess } = useRecordDetailQuery({ recordId });

  return (
    <Layout containHeader>
      {isSuccess && (
        <NavigationHeader
          rightElement={
            <RecordActionMenu
              recordId={recordId}
              isDeletable={data.isDeletable}
            />
          }
        />
      )}

      {isSuccess && data ? (
        <div className="w-full h-[80%] flex flex-col">
          <UserTemplate
            memberInfo={data.memberInfo}
            createTime={data.record.createTime}
          />
          <RecordTemplate
            record={data.record}
            gym={data.gym}
            level={data.level}
          />
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </Layout>
  );
}

const RecordActionMenu = ({
  recordId,
  isDeletable,
}: {
  recordId: string;
  isDeletable: boolean;
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const { mutate: deleteRecord } = useDeleteRecordMutation();

  const showMenuButton = isDeletable || user;

  const handleDeleteButtonClick = async () => {
    if (confirm("정말 기록을 삭제할까요?")) {
      deleteRecord(recordId, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  const handleReportButtonClick = () => {
    setIsReportOpen(true);
  };

  return (
    <>
      <Menu>
        {({ open }) => (
          <>
            {/* * Backdrop 영역 */}
            {open && <div className="bg-shadow-darkest/60 fixed inset-0" />}

            {showMenuButton && (
              <MenuButton>
                <Image
                  src="/icons/icon-hamburger.svg"
                  alt="메뉴버튼"
                  width="24"
                  height="24"
                />
              </MenuButton>
            )}

            <MenuItems
              anchor={{
                to: "bottom end",
                padding: "1.5rem",
                gap: "0.5rem",
              }}
              className="flex flex-col gap-[0.5rem] min-w-[10rem] z-dropdown rounded-xl border border-shadow-darkest/5 bg-white p-[0.5rem] text-sm focus:outline-none"
            >
              {isDeletable && (
                <MenuItem>
                  <button
                    className="block w-full text-left rounded-lg py-[0.4rem] px-[0.8rem] data-[focus]:bg-shadow-darkest/10"
                    onClick={handleDeleteButtonClick}
                  >
                    삭제하기
                  </button>
                </MenuItem>
              )}

              {user && (
                <MenuItem>
                  <button
                    className="block w-full text-left rounded-lg py-[0.4rem] px-[0.8rem] data-[focus]:bg-shadow-darkest/10"
                    onClick={handleReportButtonClick}
                  >
                    신고하기
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </>
        )}
      </Menu>

      <LayerPopup
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        fullscreen
      >
        <LayerPopup.Header title="신고하기" />
        <LayerPopup.Body>
          <ReportForm
            recordId={recordId}
            onSubmitSuccess={() => {
              alert("신고가 완료되었습니다.");
              setIsReportOpen(false);
              router.replace("/");
            }}
            onSubmitError={() => {
              alert("잠시 후 다시 시도해주세요.");
            }}
          />
        </LayerPopup.Body>
      </LayerPopup>
    </>
  );
};

const UserTemplate = ({
  memberInfo,
  createTime,
}: {
  memberInfo: MemberInfo;
  createTime: string;
}) => {
  return (
    <div className="flex">
      <Avatar size="sm" src={memberInfo.profileUrl} alt="유저정보" />
      <div className="flex flex-col justify-between h-[4rem] pl-[1rem]">
        <span className="font-bold">{memberInfo.nickname}</span>
        <span className="text-sm text-shadow ">
          {fromNowFormat(createTime)}
        </span>
      </div>
    </div>
  );
};

const RecordTemplate = ({
  record,
  gym,
  level,
}: {
  record: Record;
  gym: Gym;
  level: Level;
}) => {
  return (
    <div className="h-full pt-[2rem]">
      <div className="flex">
        <span className="px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          {gym.gymName}
        </span>
        <div className="flex items-center px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          <span>{level.colorNameKo}</span>
          <div className="pl-[0.5rem]">
            <LevelIcon color={level.colorNameEn} />
          </div>
        </div>
      </div>
      <video
        controls
        playsInline
        poster={record.thumbnailUrl}
        className="w-full h-full mt-[1rem] rounded-2xl"
      >
        <source src={record.videoUrl} type="video/mp4" />
        <source src={record.videoUrl} type="video/webm" />
        <source src={record.videoUrl} type="video/ogg" />
      </video>
    </div>
  );
};
