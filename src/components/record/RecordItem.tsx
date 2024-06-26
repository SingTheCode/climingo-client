import Image from "next/image";
import Link from "next/link";

import { Gym, Level, Record } from "@/types/record";
import { MemberInfo } from "@/types/user";
import { fromNowFormat } from "@/utils/common";

import LevelIcon from "@/components/common/LevelIcon";
import Avatar from "@/components/common/Avatar";

export default function RecordItem({
  memberInfo,
  record,
  gym,
  level,
  idx,
}: {
  memberInfo: MemberInfo;
  record: Record;
  gym: Gym;
  level: Level;
  idx: number;
}) {
  return (
    <Link className="flex justify-center" href={`/record/${record.recordId}`}>
      <div
        className={`w-full h-full min-w-[14rem] max-w-[20rem] relative ${
          idx % 2 === 0 ? "col-start-1" : "col-start-3"
        } col-span-2 rounded-xl`}
      >
        <div className="absolute top-0 left-0 flex items-center px-[1rem] py-[1rem] bg-black text-white text-2xs rounded-tl-3xl rounded-br-3xl">
          <span className="pr-[0.4rem]">{gym.gymName}</span>
          <LevelIcon color={level.colorNameEn} />
        </div>
        <Image
          className="rounded-3xl"
          priority
          width="200"
          height="400"
          src={record.thumbnailUrl}
          alt="클라이밍 기록 썸네일"
        />
        <div className="w-full absolute bottom-[1rem] flex justify-between items-center px-[1rem]">
          <div className="flex items-center">
            <Avatar size="xs" src={memberInfo.profileUrl} alt="프로필이미지" />
            <span className="w-[6rem] pl-[0.4rem] text-white text-2xs truncate">
              {memberInfo.nickname}
            </span>
          </div>
          <span className="text-white text-2xs">
            {fromNowFormat(record.createTime)}
          </span>
        </div>
      </div>
    </Link>
  );
}
