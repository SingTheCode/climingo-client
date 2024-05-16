"use client";

import { useParams } from "next/navigation";
import { useGetRecordDetailQuery } from "@/api/hooks/record";
import { UserInfo } from "@/types/user";
import { Grade, Gym, Record } from "@/types/record";
import Avatar from "@/components/common/Avatar";
import GradeIcon from "@/components/common/GradeIcon";

export default function RecordDetail() {
  const { recordId } = useParams();
  const { data, isFetched } = useGetRecordDetailQuery({
    recordId: recordId as string,
  });

  return (
    // TODO: Layout 컴포넌트 적용
    <>
      {isFetched && data ? (
        <div className="w-full h-[80%] flex flex-col">
          <UserTemplate memberInfo={data.memberInfo} />
          <RecordTemplate
            record={data.record}
            gym={data.gym}
            grade={data.grade}
          />
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}

const UserTemplate = ({ memberInfo }: { memberInfo: UserInfo }) => {
  return (
    <div className="flex">
      <Avatar size="sm" src="/assets/yellow-boulder.svg" alt="유저정보" />
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
  grade,
}: {
  record: Record;
  gym: Gym;
  grade: Grade;
}) => {
  return (
    <div className="h-full pt-[2rem]">
      <div className="flex">
        <span className="px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          {gym.gymName}
        </span>
        <div className="flex items-center px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          <span>{grade.colorNameKo}</span>
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
