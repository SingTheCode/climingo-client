"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getRecordListApi } from "@/api/modules/record";
import { MemberInfo } from "@/types/user";
import { Gym, Level, Record } from "@/types/record";

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
    <section className="w-full grid grid-cols-2 gap-5 pt-[1.6rem]">
      {recordList.map((item, idx) => (
        <RecordItem
          key={item.record.recordId}
          memberInfo={item.memberInfo}
          record={item.record}
          gym={item.gym}
          level={item.level}
          idx={idx}
        />
      ))}
    </section>
  );
};

const HomeHeader = () => {
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
        {/*TODO: 마이페이지 링크 업데이트*/}
        <Link href={"/myPage"}>
          <Image
            width="28"
            height="28"
            src="/assets/profile.svg"
            alt="프로필"
          />
        </Link>
      </div>
    </nav>
  );
};
