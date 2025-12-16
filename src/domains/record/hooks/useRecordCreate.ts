import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordApi } from '@/domains/record/api/recordApi';

interface RecordCreateData {
  gymId: number;
  levelId: number;
  description?: string;
  tags?: string[];
}

export const useRecordCreate = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: RecordCreateData) => {
      if (!videoFile) {
        throw new Error('비디오 파일이 선택되지 않았습니다.');
      }

      // 1. Presigned URL 요청
      const { presignedUrl, videoUrl, thumbnailUrl } = await recordApi.getPresignedUrl(
        videoFile.name,
        videoFile.type
      );

      // 2. 비디오 업로드
      setUploadProgress(50);
      await recordApi.uploadVideo(presignedUrl, videoFile);

      setUploadProgress(75);

      // 3. 기록 생성
      const result = await recordApi.createRecord({
        ...data,
        videoUrl,
        thumbnailUrl,
      });

      setUploadProgress(100);
      return result;
    },
    onSuccess: () => {
      // 기록 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['records'] });
      
      // 상태 초기화
      setVideoFile(null);
      setUploadProgress(0);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  const handleVideoSelect = useCallback((file: File) => {
    setVideoFile(file);
    setUploadProgress(0);
  }, []);

  const handleSubmit = useCallback((data: RecordCreateData) => {
    createMutation.mutate(data);
  }, [createMutation]);

  const resetForm = useCallback(() => {
    setVideoFile(null);
    setUploadProgress(0);
    createMutation.reset();
  }, [createMutation]);

  return {
    videoFile,
    uploadProgress,
    isUploading: createMutation.isPending,
    isSuccess: createMutation.isSuccess,
    error: createMutation.error,
    handleVideoSelect,
    handleSubmit,
    resetForm,
  };
};
