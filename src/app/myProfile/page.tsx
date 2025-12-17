"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MyProfile } from "@/domains/profile/components/MyProfile";
import { AsyncBoundary } from "@/lib/async";
import Layout from "@/components/Layout";
import NavigationHeader from "@/components/NavigationHeader";
import RecordItem, {
  RecordItemContainer,
  RecordItemSkeleton,
  EmptyRecordItem,
} from "@/domains/record/components/RecordItem";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useGetMyRecordListQuery } from "@/domains/profile/hooks/useGetMyRecordListQuery";

function MyProfileContent() {
  return (
    <section className="flex flex-col gap-[4rem] py-[2.5rem]">
      <MyProfile>
        <div className="flex items-center gap-[1.5rem]">
          <MyProfile.Avatar />
          <MyProfile.Nickname />
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
      </MyProfile>

      <article className="flex flex-col gap-[1.5rem]">
        <h3 className="font-medium">클라이밍 기록</h3>
        <MyRecordList />
      </article>
    </section>
  );
}

function MyRecordList() {
  const { ref, inView } = useIntersectionObserver();
  const { data, isSuccess, isFetching, fetchNextPage } =
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
    <>
      {isSuccess && (
        <RecordItemContainer>
          {data.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.contents.map((item) => (
                <RecordItem
                  key={item.record.recordId}
                  record={item.record}
                  gym={item.gym}
                  level={item.level}
                  memberInfo={item.memberInfo}
                  showMemberInfo={false}
                />
              ))}
            </Fragment>
          ))}
        </RecordItemContainer>
      )}

      {isFetching && <RecordItemSkeleton />}
      <div ref={ref} />
    </>
  );
}

export default function MyProfilePage() {
  return (
    <Layout containHeader>
      <NavigationHeader
        rightElement={
          <Link href="/record/create">
            <Image
              src="/icons/icon-write.svg"
              alt="기록하기"
              width={24}
              height={24}
            />
          </Link>
        }
      />
      <AsyncBoundary
        pendingFallback={
          <div className="p-4">
            <div className="flex items-center gap-[1.5rem] animate-pulse">
              <div className="w-[6rem] h-[6rem] bg-shadow rounded-full"></div>
              <div className="w-[12rem] h-[2rem] bg-shadow"></div>
            </div>
          </div>
        }
        rejectedFallback={() => (
          <div className="p-4 text-center text-red-500">
            프로필을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      >
        <MyProfileContent />
      </AsyncBoundary>
    </Layout>
  );
}
