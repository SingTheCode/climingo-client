"use client";

import { createContext, useContext, ReactNode } from "react";

import type {
  RecordFilter,
  RecordMetadata,
} from "@/domains/record/types/entity";

import { useRecordList } from "@/domains/record/hooks/useRecordListQuery";

// Context 타입 정의
type RecordListContextType = ReturnType<typeof useRecordList>;

const RecordListContext = createContext<RecordListContextType | null>(null);

// Context Hook
const useRecordListContext = () => {
  const context = useContext(RecordListContext);
  if (!context) {
    throw new Error("RecordList 컴포넌트 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

// Root Component
interface RecordListProps {
  children: ReactNode;
  initialFilter?: RecordFilter;
}

export const RecordList = ({ children, initialFilter }: RecordListProps) => {
  const recordList = useRecordList(initialFilter);

  return (
    <RecordListContext.Provider value={recordList}>
      {children}
    </RecordListContext.Provider>
  );
};

// Filter Component
interface FilterProps {
  children: (props: {
    filter: RecordFilter;
    updateFilter: (filter: Partial<RecordFilter>) => void;
    clearFilter: () => void;
  }) => ReactNode;
}

function RecordListFilter({ children }: FilterProps) {
  const { filter, updateFilter, clearFilter } = useRecordListContext();
  return <>{children({ filter, updateFilter, clearFilter })}</>;
}

RecordList.Filter = RecordListFilter;

// Items Component
interface ItemsProps {
  children: (props: { records: RecordMetadata[] }) => ReactNode;
}

function RecordListItems({ children }: ItemsProps) {
  const { records } = useRecordListContext();
  return <>{children({ records })}</>;
}

RecordList.Items = RecordListItems;

// LoadMore Component
interface LoadMoreProps {
  children: (props: {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
  }) => ReactNode;
}

function RecordListLoadMore({ children }: LoadMoreProps) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRecordListContext();
  return <>{children({ hasNextPage, isFetchingNextPage, fetchNextPage })}</>;
}

RecordList.LoadMore = RecordListLoadMore;
