"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getRecordListApi } from "@/api/modules/record";
import { MemberInfo } from "@/types/user";
import { Gym, Level, Record } from "@/types/record";
import { loginCheck } from "@/utils/common";

import Layout from "@/components/common/Layout";
import RecordItem from "@/components/record/RecordItem";
import FilterSection from "@/components/record/FilterSection";
import FloatingButton from "@/components/common/FloatingButton";

export default function RecordList() {
  const observedRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState({
    gym: {
      id: 0,
      name: "",
    },
    level: {
      id: 0,
      name: "",
    },
  });
  const [recordList, setRecordList] = useState<
    {
      memberInfo: MemberInfo;
      record: Record;
      gym: Gym;
      level: Level;
    }[]
  >([]);
  const page = useRef(0);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getRecordList();
        }
      });
    },
    { threshold: 0 }
  );

  const getRecordList = async () => {
    const data = await getRecordListApi({
      gymId: filter.gym.id,
      levelId: filter.level.id,
      page: page.current,
    });

    if (page.current === 0) {
      setRecordList(data.contents);
      page.current = data.page + 1;
      return;
    }

    if (data.isEnd) {
      observer.disconnect();
      return;
    }

    setRecordList((prev) => [...prev, ...data.contents]);
    page.current = data.page + 1;
  };

  useEffect(() => {
    if (observedRef.current) {
      observer.observe(observedRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    page.current = 0;
    setRecordList([]);
    if (observedRef.current) {
      observer.observe(observedRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [filter]);

  return (
    <Layout containHeader>
      <HomeHeader />
      <FilterSection filter={filter} setFilter={setFilter} />
      <RecordListSection recordList={recordList} />
      <div className="h-[1rem]" ref={observedRef} />
      <Link href={"/record/create"}>
        <FloatingButton />
      </Link>
    </Layout>
  );
}

const RecordListSection = ({
  recordList,
}: {
  recordList: {
    memberInfo: MemberInfo;
    record: Record;
    gym: Gym;
    level: Level;
  }[];
}) => {
  return (
    <section
      className={`w-full ${recordList.length > 0 ? "grid grid-cols-2" : "flex justify-center items-center h-[70vh]"} gap-5 pt-[1.6rem]`}
    >
      {recordList.length > 0 ? (
        recordList.map((item, idx) => (
          <RecordItem
            key={item.record.recordId}
            memberInfo={item.memberInfo}
            record={item.record}
            gym={item.gym}
            level={item.level}
            idx={idx}
          />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/icons/icon-warning.svg"
            alt="기록이 없어요"
            width="22"
            height="22"
          />
          <span className="pt-[1rem] text-sm">아직 기록이 없어요</span>
        </div>
      )}
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
