"use client";

import { useParams } from "next/navigation";

import "@/utils/common";
import { useGetRecordDetailQuery } from "@/api/hooks/record";
import { MemberInfo } from "@/types/user";
import { Level, Gym, Record } from "@/types/record";
import { fromNowFormat } from "@/utils/common";

import Avatar from "@/components/common/Avatar";
import LevelIcon from "@/components/common/LevelIcon";
import Layout from "@/components/common/Layout";
import Loading from "@/components/common/Loading";
import NavigationHeader from "@/components/common/NavigationHeader";

export default function RecordDetail() {
  const { recordId } = useParams();
  const { data, isSuccess } = useGetRecordDetailQuery({
    recordId: recordId as string,
  });

  return (
    <Layout containHeader>
      <NavigationHeader />
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
      <video controls className="w-full h-full mt-[1rem] rounded-2xl">
        <source src={record.videoUrl} type="video/mp4" />
        <source src={record.videoUrl} type="video/webm" />
        <source src={record.videoUrl} type="video/ogg" />
      </video>
    </div>
  );
};
