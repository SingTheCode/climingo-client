"use client";

import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";

import { AsyncBoundary } from "@/lib/async";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";

import { useNavigateWithAuth } from "@/domains/auth/hooks/useNavigateWithAuth";

import Layout from "@/components/Layout";

import FilterSection from "@/domains/record/components/FilterSection";
import RecordItem, {
  RecordItemContainer,
  EmptyRecordItem,
  RecordItemSkeleton,
} from "@/domains/record/components/RecordItem";
import { RecordList } from "@/domains/record/components/RecordList";

export default function Home() {
  return (
    <Layout containHeader>
      <HomeHeader />
      <AsyncBoundary
        pendingFallback={
          <section className="w-full pt-[1.6rem]">
            <ul className="grid grid-cols-2 w-full gap-[1rem] sm:max-w-[48rem] mx-auto">
              <RecordItemSkeleton />
              <RecordItemSkeleton />
              <RecordItemSkeleton />
              <RecordItemSkeleton />
              <RecordItemSkeleton />
              <RecordItemSkeleton />
            </ul>
            <div className="h-[1rem]"></div>
          </section>
        }
        rejectedFallback={() => (
          <div className="p-4 text-center text-red-500">
            기록을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      >
        <RecordListContent />
      </AsyncBoundary>
      <FloatingActionMenu />
    </Layout>
  );
}

function HomeHeader() {
  return (
    <nav className="h-[5.6rem] fixed top-0 left-0 flex items-center justify-between w-screen z-navigation overflow-y-hidden bg-white">
      <div className="px-[2rem]">
        <Link href="/">
          <Image
            alt="클라밍고"
            width={100}
            height={24}
            src="/assets/main-logo.svg"
          />
        </Link>
      </div>
      <div className="flex py-[0.2rem] pr-[2rem]">
        <Link href="/profile">
          <Image
            alt="프로필"
            width={28}
            height={28}
            src="/assets/profile.svg"
          />
        </Link>
      </div>
    </nav>
  );
}

function RecordListContent() {
  return (
    <RecordList>
      <RecordList.Filter>
        {({ filter, updateFilter }) => (
          <FilterSection
            filter={{
              gym: { id: filter.gymId || 0, name: "" },
              level: { id: filter.levelId || 0, name: "" },
            }}
            setFilter={(newFilter) => {
              const filterValue =
                typeof newFilter === "function"
                  ? newFilter({
                      gym: { id: filter.gymId || 0, name: "" },
                      level: { id: filter.levelId || 0, name: "" },
                    })
                  : newFilter;

              updateFilter({
                gymId: filterValue.gym.id || undefined,
                levelId: filterValue.level.id || undefined,
              });
            }}
          />
        )}
      </RecordList.Filter>

      <section className="w-full pt-[1.6rem]">
        <RecordList.Items>
          {({ records, totalElements }) => (
            <>
              {totalElements === 0 ? (
                <EmptyRecordItem />
              ) : (
                <RecordItemContainer>
                  {records.map((record) => (
                    <RecordItem
                      key={record.record.recordId}
                      record={record.record}
                      gym={record.gym}
                      level={record.level}
                      memberInfo={record.memberInfo ?? null}
                    />
                  ))}
                </RecordItemContainer>
              )}
            </>
          )}
        </RecordList.Items>

        <RecordList.LoadMore>
          {({ hasNextPage, isFetchingNextPage, fetchNextPage }) => (
            <LoadMoreTrigger
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          )}
        </RecordList.LoadMore>
        <div className="h-[1rem]"></div>
      </section>
    </RecordList>
  );
}

function LoadMoreTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const { ref, inView } = useIntersectionObserver();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={ref} className="h-10">
      {isFetchingNextPage && <RecordItemSkeleton />}
    </div>
  );
}

interface MenuOption {
  label: string;
  icon: string;
  onClick: () => void;
}

function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigateWithAuth = useNavigateWithAuth();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const menuOptions: MenuOption[] = useMemo(
    () => [
      {
        label: "찍볼 만들기",
        icon: "/icons/icon-photo.svg",
        onClick: () =>
          navigateWithAuth("/jjikboul/create", () => handleClose()),
      },
      {
        label: "클라이밍 기록하기",
        icon: "/icons/icon-write.svg",
        onClick: () => navigateWithAuth("/record/create", () => handleClose()),
      },
    ],
    [navigateWithAuth]
  );

  return (
    <>
      <FloatingActionBackdrop isOpen={isOpen} onClose={handleClose} />

      <div className="fixed right-[2rem] bottom-[2rem] z-floating flex flex-col items-end gap-[1.2rem]">
        <FloatingActionMenuItems menuOptions={menuOptions} isOpen={isOpen} />

        <button
          onClick={handleToggle}
          className="w-[6rem] h-[6rem] rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 shadow-lg"
        >
          <div
            className={`transition-transform duration-200 ease-in-out ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <Image
              width="22"
              height="22"
              src="/icons/icon-plus.svg"
              alt={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            />
          </div>
        </button>
      </div>
    </>
  );
}

interface BackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

function FloatingActionBackdrop({ isOpen, onClose }: BackdropProps) {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black/30 z-overlay" onClick={onClose} />
    </Transition>
  );
}

interface MenuItemsProps {
  menuOptions: MenuOption[];
  isOpen: boolean;
}

function FloatingActionMenuItems({ menuOptions, isOpen }: MenuItemsProps) {
  return (
    <>
      {menuOptions.map((option, index) => (
        <Transition
          key={option.label}
          show={isOpen}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <div
            className="transition-all"
            style={{
              transitionDelay: isOpen
                ? `${index * 50}ms`
                : `${(menuOptions.length - 1 - index) * 50}ms`,
            }}
          >
            <button
              onClick={option.onClick}
              className="flex items-center gap-[1.2rem] bg-white rounded-full px-[2rem] py-[1.2rem] shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <span className="text-sm font-medium text-ink whitespace-nowrap">
                {option.label}
              </span>
              <div className="w-[2.4rem] h-[2.4rem] flex items-center justify-center">
                <Image
                  width="20"
                  height="20"
                  src={option.icon}
                  alt={option.label}
                />
              </div>
            </button>
          </div>
        </Transition>
      ))}
    </>
  );
}
