import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { RecordMetadata } from "@/types/record";
import { fromNowFormat } from "@/utils/common";

import Avatar from "@/components/common/Avatar";
import LevelIcon from "@/components/common/LevelIcon";

export const RecordThumbnailList = ({ children }: { children?: ReactNode }) => {
  return (
    <ul className="grid grid-cols-2 w-full gap-[1rem] sm:max-w-[48rem] mx-auto">
      {children}
    </ul>
  );
};

export const RecordThumbnailCard = ({
  record,
  level,
  gym,
  memberInfo,
  showMemberInfo = true,
}: RecordMetadata & { showMemberInfo?: boolean }) => {
  const shouldRenderMemberInfo = memberInfo && showMemberInfo;

  return (
    <li className="relative w-full h-auto aspect-[17/28] bg-white rounded-[1rem] overflow-hidden">
      <Link
        href={`/record/${record.recordId}`}
        className="absolute w-full h-full"
      >
        {/** 썸네일 이미지 */}
        <Image
          src={record.thumbnailUrl}
          alt="thumbnail"
          sizes="(max-width: 640px) 49vw, 235px"
          fill
        />

        {/** 배경 그라데이션 */}
        <span className="bg-card-gradient w-full h-full absolute"></span>

        {/** 암장 난이도 라벨 */}
        <div className="absolute h-[2.6rem] bg-black rounded-br-[1rem] px-[1rem] flex items-center gap-[0.5rem]">
          <p className="text-white font-semibold text-[1.1rem] truncate">
            {gym.gymName}
          </p>
          <LevelIcon color={level.colorNameEn} />
        </div>

        {/** 기록 작성자, 작성일 정보 */}
        <div
          className={`absolute bottom-0 p-[1rem] flex items-center gap-[0.7rem] justify-between w-full ${
            shouldRenderMemberInfo ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {shouldRenderMemberInfo && (
            <>
              <Avatar src={memberInfo.profileUrl} size="xs" alt="profile" />
              <p className="text-white text-xs flex-grow truncate">
                {memberInfo.nickname}
              </p>
            </>
          )}
          <p className="text-shadow-lighter text-xs shrink-0 justify-self-end">
            {fromNowFormat(record.createTime)}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default RecordThumbnailCard;

export const RecordThumbnailCardSkeleton = () => (
  <li className="min-w-[17rem] h-auto aspect-[17/28] rounded-[1rem] overflow-hidden bg-shadow animate-pulse"></li>
);
