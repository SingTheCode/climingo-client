"use client";

import { useEffect, useRef, useState } from "react";

import { getRecordListApi } from "@/api/modules/record";
import { MemberInfo } from "@/types/user";
import { Gym, Level, Record } from "@/types/record";
import Layout from "@/components/common/Layout";
import RecordItem from "@/components/record/RecordItem";
import FilterSection from "@/components/record/FilterSection";

export default function RecordList() {
  const observedRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState({
    gym: {
      id: "",
      name: "",
    },
    level: {
      id: "",
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

    if (data.isEnd) {
      observer.disconnect();
      return;
    }

    if (page.current === 0) {
      setRecordList(data.contents);
      page.current = data.page + 1;
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
      <FilterSection filter={filter} setFilter={setFilter} />
      <RecordListSection recordList={recordList} />
      <div className="h-[1rem]" ref={observedRef} />
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
    <section className="w-full grid grid-cols-4 gap-5 pt-[1.6rem]">
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
