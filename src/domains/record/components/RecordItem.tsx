import Image from "next/image";
import Link from "next/link";

import type { RecordMetadata } from '@/domains/record/types/entity';
import { fromNowFormat } from "@/utils/common";

import LevelIcon from "@/domains/place/components/LevelIcon";
import Avatar from "@/components/common/Avatar";

export const RecordItemContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <ul className="grid grid-cols-2 w-full gap-[1rem] sm:max-w-[48rem] mx-auto">
      {children}
    </ul>
  );
};

export default function RecordItem({
  memberInfo,
  record,
  gym,
  level,
  showMemberInfo = true,
}: RecordMetadata & {
  showMemberInfo?: boolean;
}) {
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
          alt={`기록 ${record.recordId}번에 대한 썸네일`}
          sizes="(max-width: 640px) 49vw, 235px"
          fill
        />

        {/** 배경 그라데이션 */}
        <span className="bg-card-gradient w-full h-full absolute"></span>

        {/** 암장 난이도 라벨 */}
        <div className="absolute h-[2.6rem] bg-black rounded-br-[1rem] px-[1rem] flex items-center gap-[0.5rem]">
          <span className="text-white font-semibold text-[1.1rem] truncate">
            {gym.gymName}
          </span>
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
              <span className="text-white text-xs flex-grow truncate">
                {memberInfo.nickname}
              </span>
            </>
          )}
          <span className="text-shadow-lighter text-xs shrink-0 justify-self-end">
            {fromNowFormat(record.createTime)}
          </span>
        </div>
      </Link>
    </li>
  );
}

export const RecordItemSkeleton = () => (
  <li className="min-w-[17rem] h-auto aspect-[17/28] rounded-[1rem] overflow-hidden bg-shadow animate-pulse"></li>
);

export const EmptyRecordItem = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col justify-center items-center">
      <Image
        src="/icons/icon-warning.svg"
        alt="기록이 없어요"
        width="22"
        height="22"
      />
      <p className="pt-[1rem] text-sm">아직 기록이 없어요</p>
    </div>
  );
};
