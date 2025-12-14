'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRecordCreate } from '@/domains/record/hooks/useRecordCreate';

// Context 타입 정의
type RecordFormContextType = ReturnType<typeof useRecordCreate>;

const RecordFormContext = createContext<RecordFormContextType | null>(null);

// Context Hook
const useRecordFormContext = () => {
  const context = useContext(RecordFormContext);
  if (!context) {
    throw new Error('RecordForm 컴포넌트 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

// Root Component
interface RecordFormProps {
  children: ReactNode;
}

export const RecordForm = ({ children }: RecordFormProps) => {
  const recordForm = useRecordCreate();
  
  return (
    <RecordFormContext.Provider value={recordForm}>
      {children}
    </RecordFormContext.Provider>
  );
};

// VideoUpload Component
interface VideoUploadProps {
  children: (props: {
    videoFile: File | null;
    handleVideoSelect: (file: File) => void;
    uploadProgress: number;
    isUploading: boolean;
  }) => ReactNode;
}

function RecordFormVideoUpload({ children }: VideoUploadProps) {
  const { videoFile, handleVideoSelect, uploadProgress, isUploading } = useRecordFormContext();
  return <>{children({
    videoFile,
    handleVideoSelect,
    uploadProgress,
    isUploading,
  })}</>;
}

RecordForm.VideoUpload = RecordFormVideoUpload;

// PlaceSelect Component
interface PlaceSelectProps {
  children: (props: {
    onGymSelect: (gymId: number) => void;
    onLevelSelect: (levelId: number) => void;
  }) => ReactNode;
}

function RecordFormPlaceSelect({ children }: PlaceSelectProps) {
  // 실제로는 gym, level 선택 로직이 필요하지만 여기서는 콜백만 제공
  const onGymSelect = (_gymId: number) => {
    // 상위 컴포넌트에서 처리
  };
  
  const onLevelSelect = (_levelId: number) => {
    // 상위 컴포넌트에서 처리
  };
  
  return <>{children({ onGymSelect, onLevelSelect })}</>;
}

RecordForm.PlaceSelect = RecordFormPlaceSelect;

// Submit Component
interface SubmitProps {
  children: (props: {
    handleSubmit: (data: {
      gymId: number;
      levelId: number;
      description?: string;
      tags?: string[];
    }) => void;
    isUploading: boolean;
    isSuccess: boolean;
    error: Error | null;
    resetForm: () => void;
  }) => ReactNode;
}

function RecordFormSubmit({ children }: SubmitProps) {
  const { handleSubmit, isUploading, isSuccess, error, resetForm } = useRecordFormContext();
  return <>{children({
    handleSubmit,
    isUploading,
    isSuccess,
    error,
    resetForm,
  })}</>;
}

RecordForm.Submit = RecordFormSubmit;
