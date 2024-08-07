"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import useGetMyProfileQuery from "@/hooks/profile/useGetMyProfileQuery";
import useGetMyRecordListQuery from "@/hooks/profile/useGetMyRecordListQuery";

import Avatar from "@/components/common/Avatar";
import RecordItem, {
  RecordItemContainer,
  RecordItemSkeleton,
  EmptyRecordItem,
} from "@/components/record/RecordItem";

const MyProfile = () => {
  return (
    <section className="flex flex-col gap-[4rem] py-[2.5rem]">
      <MyShortProfile />

      <article className="flex flex-col gap-[1.5rem]">
        <h3 className="font-medium">클라이밍 기록</h3>
        <MyRecordList />
      </article>
    </section>
  );
};

export default MyProfile;

const MyShortProfile = () => {
  const { data, isSuccess } = useGetMyProfileQuery();

  // Skeleton
  if (!isSuccess) {
    return (
      <div className="flex items-center gap-[1.5rem] animate-pulse">
        <div className="w-[6rem] h-[6rem] bg-shadow rounded-full"></div>
        <div className="w-[12rem] h-[2rem] bg-shadow"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[1.5rem]">
      <Avatar src={data.profileUrl} size="base" alt="profile" priority />
      <p className="text-xl font-bold line-clamp-2">{data.nickname}</p>
      <Link href="/myProfile/detail" className="-ml-[1rem] shrink-0">
        <Image
          src="/icons/icon-arrow-right.svg"
          width={20}
          height={20}
          alt="프로필 상세보기"
        />
        <span className="sr-only">프로필 상세보기</span>
      </Link>
    </div>
  );
};

const MyRecordList = () => {
  const { ref, inView } = useIntersectionObserver();
  const { data, isSuccess, isFetching, isFetchingNextPage, fetchNextPage } =
    useGetMyRecordListQuery();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isSuccess && data.pages[0].totalCount === 0) {
    return <EmptyRecordItem />;
  }

  return (
    <RecordItemContainer>
      {isSuccess &&
        data.pages.map(({ page, contents }) => (
          <Fragment key={page}>
            {contents.map((metadata) => (
              <RecordItem
                key={metadata.record.recordId}
                showMemberInfo={false}
                {...metadata}
              />
            ))}
          </Fragment>
        ))}

      {/** Skeleton */}
      {!isFetching && isFetchingNextPage && (
        <>
          <RecordItemSkeleton />
          <RecordItemSkeleton />
        </>
      )}

      <div ref={ref} />
    </RecordItemContainer>
  );
};
