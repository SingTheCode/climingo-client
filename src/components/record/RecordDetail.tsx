"use client";

import { useParams } from "next/navigation";

import { useGetRecordDetailQuery } from "@/api/hooks/record";
import { MemberInfo } from "@/types/user";
import { Level, Gym, Record } from "@/types/record";
import Avatar from "@/components/common/Avatar";
import Layout from "@/components/common/Layout";

export default function RecordDetail() {
  const { recordId } = useParams();
  const { data, isFetched } = useGetRecordDetailQuery({
    recordId: recordId as string,
  });

  return (
    // TODO: Layout 컴포넌트 적용
    <Layout containHeader>
      {isFetched && data ? (
        <div className="w-full h-[80%] flex flex-col">
          <UserTemplate memberInfo={data.memberInfo} />
          <RecordTemplate
            record={data.record}
            gym={data.gym}
            level={data.level}
          />
        </div>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
}

const UserTemplate = ({ memberInfo }: { memberInfo: MemberInfo }) => {
  return (
    <div className="flex">
      <Avatar size="sm" src={memberInfo.profileUrl} alt="유저정보" />
      <div className="flex flex-col justify-between h-[4rem] pl-[1rem]">
        <span className="font-bold">{memberInfo.nickname}</span>
        <span className="text-sm text-shadow ">10분 전</span>
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
            <GradeIcon color="white" />
          </div>
        </div>
      </div>
      <video controls className="w-full h-full mt-[1rem] rounded-2xl">
        <source src={record.videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};
