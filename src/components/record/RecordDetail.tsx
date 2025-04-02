"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { useGetRecordDetailQuery } from "@/api/hooks/record";
import useDeleteRecordMutation from "@/hooks/record/useDeleteRecordMutation";
import { MemberInfo } from "@/types/auth";
import { Level, Gym, Record } from "@/types/record";
import { fromNowFormat } from "@/utils/common";

import Avatar from "@/components/common/Avatar";
import LevelIcon from "@/components/common/LevelIcon";
import Layout from "@/components/common/Layout";
import Loading from "@/components/common/Loading";
import NavigationHeader from "@/components/common/NavigationHeader";
import LayerPopup from "@/components/common/LayerPopup";
import ReportForm from "@/components/record/ReportForm";

export default function RecordDetail() {
  const params = useParams();
  const recordId = params?.recordId as string;

  const { data, isSuccess } = useGetRecordDetailQuery({ recordId });

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
  const { mutate: deleteRecord } = useDeleteRecordMutation();

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

            <MenuButton>
              <Image
                src="/icons/icon-hamburger.svg"
                alt="메뉴버튼"
                width="24"
                height="24"
              />
            </MenuButton>

            <MenuItems
              anchor={{
                to: "bottom end",
                padding: "1.5rem",
                gap: "0.5rem",
              }}
              className="flex flex-col gap-[0.5rem] min-w-[10rem] z-[350] rounded-xl border border-shadow-darkest/5 bg-white p-[0.5rem] text-sm focus:outline-none"
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

              <MenuItem>
                <button
                  className="block w-full text-left rounded-lg py-[0.4rem] px-[0.8rem] data-[focus]:bg-shadow-darkest/10"
                  onClick={handleReportButtonClick}
                >
                  신고하기
                </button>
              </MenuItem>
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
          <ReportForm />
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
