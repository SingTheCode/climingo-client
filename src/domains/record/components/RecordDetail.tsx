'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRecordDetail } from '@/domains/record/hooks/useRecordDetail';
import type { RecordDetail as RecordDetailType } from '@/domains/record/types/entity';

// Context 타입 정의
type RecordDetailContextType = ReturnType<typeof useRecordDetail>;

const RecordDetailContext = createContext<RecordDetailContextType | null>(null);

// Context Hook
const useRecordDetailContext = () => {
  const context = useContext(RecordDetailContext);
  if (!context) {
    throw new Error('RecordDetail 컴포넌트 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

// Root Component
interface RecordDetailProps {
  children: ReactNode;
  recordId: number;
}

export const RecordDetail = ({ children, recordId }: RecordDetailProps) => {
  const recordDetail = useRecordDetail(recordId);
  
  return (
    <RecordDetailContext.Provider value={recordDetail}>
      {children}
    </RecordDetailContext.Provider>
  );
};

// Video Component
interface VideoProps {
  children: (props: {
    videoUrl: string;
    thumbnailUrl: string;
  }) => ReactNode;
}

function RecordDetailVideo({ children }: VideoProps) {
  const { record } = useRecordDetailContext();
  return <>{children({
    videoUrl: record.record.videoUrl,
    thumbnailUrl: record.record.thumbnailUrl,
  })}</>;
}

RecordDetail.Video = RecordDetailVideo;

// Info Component
interface InfoProps {
  children: (props: {
    record: RecordDetailType;
  }) => ReactNode;
}

function RecordDetailInfo({ children }: InfoProps) {
  const { record } = useRecordDetailContext();
  return <>{children({ record })}</>;
}

RecordDetail.Info = RecordDetailInfo;

// Actions Component
interface ActionsProps {
  children: (props: {
    recordId: number;
    memberId: number | null;
  }) => ReactNode;
}

function RecordDetailActions({ children }: ActionsProps) {
  const { record } = useRecordDetailContext();
  return <>{children({
    recordId: record.record.recordId,
    memberId: record.memberInfo?.memberId || null,
  })}</>;
}

RecordDetail.Actions = RecordDetailActions;
