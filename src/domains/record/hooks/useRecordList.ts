import { useState } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { recordApi } from '@/domains/record/api/recordApi';
import type { RecordFilter } from '@/domains/record/types/entity';

export const useRecordList = (initialFilter: RecordFilter = {}) => {
  const [filter, setFilter] = useState<RecordFilter>({
    size: 10,
    ...initialFilter,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['records', filter],
    queryFn: ({ pageParam = 0 }) =>
      recordApi.getRecordList({ ...filter, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLast) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 0,
  });

  // 모든 페이지의 기록들을 평면화
  const records = data.pages.flatMap(page => page.records);
  const totalElements = data.pages[0]?.totalElements ?? 0;

  const updateFilter = (newFilter: Partial<RecordFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const clearFilter = () => {
    setFilter({ size: 10 });
  };

  return {
    records,
    totalElements,
    filter,
    updateFilter,
    clearFilter,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
