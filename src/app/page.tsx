'use client';

import { useEffect } from 'react';
import { RecordList } from '@/domains/record/components/RecordList';
import { AsyncBoundary } from '@/lib/async';
import Layout from '@/components/common/Layout';
import FilterSection from '@/components/record/FilterSection';
import FloatingActionMenu from '@/components/common/FloatingActionMenu';
import RecordItem, {
  RecordItemContainer,
  EmptyRecordItem,
  RecordItemSkeleton,
} from '@/components/record/RecordItem';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

function HomeHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <h1 className="text-xl font-bold">클라이밍 기록</h1>
    </header>
  );
}

function RecordListContent() {
  return (
    <RecordList>
      <RecordList.Filter>
        {({ filter, updateFilter }) => (
          <FilterSection
            filter={{
              gym: { id: filter.gymId || 0, name: '' },
              level: { id: filter.levelId || 0, name: '' },
            }}
            setFilter={(newFilter) => {
              const filterValue = typeof newFilter === 'function' 
                ? newFilter({ gym: { id: filter.gymId || 0, name: '' }, level: { id: filter.levelId || 0, name: '' } })
                : newFilter;
              
              updateFilter({
                gymId: filterValue.gym.id || undefined,
                levelId: filterValue.level.id || undefined,
              });
            }}
          />
        )}
      </RecordList.Filter>

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
                    memberInfo={record.memberInfo || undefined}
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

export default function Home() {
  return (
    <Layout containHeader>
      <HomeHeader />
      <AsyncBoundary
        pendingFallback={
          <div className="p-4">
            <RecordItemSkeleton />
          </div>
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
