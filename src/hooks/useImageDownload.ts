import { useCallback, useEffect, useRef, useState } from "react";
import { ImageDownloadParams, ImageDownloadResult } from "@/types/appScheme";

const useImageDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadResult, setDownloadResult] =
    useState<ImageDownloadResult | null>(null);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isNativeDownloadAvailable = useCallback((): boolean => {
    return !!window.webkit?.messageHandlers?.downloadImage;
  }, []);

  const showDownloadProgress = useCallback(() => {
    setIsDownloading(true);
    setDownloadResult(null);
  }, []);

  const hideDownloadProgress = useCallback(() => {
    setIsDownloading(false);
  }, []);

  const showDownloadResult = useCallback((result: ImageDownloadResult) => {
    setDownloadResult(result);
    setIsDownloading(false);

    setTimeout(() => {
      setDownloadResult(null);
    }, 3000);
  }, []);

  const downloadImage = useCallback(
    (imageUrl: string): void => {
      if (!isNativeDownloadAvailable()) {
        console.log("네이티브 이미지 다운로드 기능을 사용할 수 없습니다.");
        return;
      }

      try {
        const params: ImageDownloadParams = { url: imageUrl };
        window.webkit!.messageHandlers.downloadImage.postMessage(params);
      } catch (error) {
        console.error("이미지 다운로드 중 오류가 발생했습니다:", error);
        showDownloadResult({
          success: false,
          message: "이미지 다운로드 중 오류가 발생했습니다.",
        });
      }
    },
    [isNativeDownloadAvailable, showDownloadResult]
  );

  useEffect(() => {
    window.onImageDownloadStart = () => {
      showDownloadProgress();

      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }

      downloadTimeoutRef.current = setTimeout(() => {
        showDownloadResult({
          success: false,
          message: "다운로드 시간이 초과되었습니다.",
        });
      }, 30000);
    };

    return () => {
      window.onImageDownloadStart = undefined;
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, [showDownloadProgress, showDownloadResult]);

  useEffect(() => {
    window.onImageDownloadComplete = (result: ImageDownloadResult) => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
        downloadTimeoutRef.current = null;
      }

      showDownloadResult(result);
    };

    return () => {
      window.onImageDownloadComplete = undefined;
    };
  }, [showDownloadResult]);

  return {
    downloadImage,
    isNativeDownloadAvailable,
    isDownloading,
    downloadResult,
    hideDownloadProgress,
  };
};

export default useImageDownload;
