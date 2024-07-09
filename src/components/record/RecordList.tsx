"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginCheck } from "@/utils/common";
import useGetRecordListQuery from "@/hooks/record/useRecordListQuery";
import useInView from "@/hooks/useInView";

import Layout from "@/components/common/Layout";
import FilterSection from "@/components/record/FilterSection";
import FloatingButton from "@/components/common/FloatingButton";
import RecordItem, {
  RecordItemContainer,
  EmptyRecordItem,
} from "@/components/record/RecordItem";

interface RecordFilter {
  gym: { id: number; name: string };
  level: { id: number; name: string };
}

export default function RecordList() {
  const [filter, setFilter] = useState<RecordFilter>({
    gym: {
      id: 0,
      name: "",
    },
    level: {
      id: 0,
      name: "",
    },
  });

  return (
    <Layout containHeader>
      <HomeHeader />
      <FilterSection filter={filter} setFilter={setFilter} />
      <RecordListSection filter={filter} />
      <Link href={"/record/create"}>
        <FloatingButton />
      </Link>
    </Layout>
  );
}

const RecordListSection = ({ filter }: { filter: RecordFilter }) => {
  const { ref, inView } = useInView();
  const { data, isSuccess, fetchNextPage } = useGetRecordListQuery({
    levelId: filter.level.id,
    gymId: filter.gym.id,
  });

  const recordList = data?.pages.flatMap(({ contents }) => contents);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isSuccess && data.pages[0].totalCount === 0) {
    return <EmptyRecordItem />;
  }

  return (
    <section className="w-full pt-[1.6rem]">
      {isSuccess && recordList && (
        <RecordItemContainer>
          {recordList.map((item) => (
            <RecordItem
              key={item.record.recordId}
              memberInfo={item.memberInfo}
              record={item.record}
              gym={item.gym}
              level={item.level}
            />
          ))}
        </RecordItemContainer>
      )}
      <div className="h-[1rem]" ref={ref} />
    </section>
  );
};

const HomeHeader = () => {
  const router = useRouter();

  const goToMyProfile = () => {
    if (loginCheck()) {
      router.push("/myProfile");
    }
  };

  return (
    <nav className="h-[5.6rem] fixed top-0 left-0 flex items-center justify-between w-screen z-[300] overflow-y-hidden bg-white">
      {/** left */}
      <div className="px-[2rem]">
        <Link href={"/"}>
          <Image
            width="100"
            height="24"
            src="/assets/main-logo.svg"
            alt="클라밍고"
          />
        </Link>
      </div>

      {/** right */}
      <div className="flex py-[0.2rem] pr-[2rem]">
        <button onClick={goToMyProfile}>
          <Image
            width="28"
            height="28"
            src="/assets/profile.svg"
            alt="프로필"
          />
        </button>
      </div>
    </nav>
  );
};
