import { useCallback, useEffect, useRef, useState } from "react";
import { ImageDownloadParams, ImageDownloadResult } from "@/shared/types/appScheme";

const useImageDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadResult, setDownloadResult] =
    useState<ImageDownloadResult | null>(null);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const isNativeDownloadAvailable = useCallback((): boolean => {
    return !!window.webkit?.messageHandlers?.downloadImage;
  }, []);

  const downloadImageInBrowser = useCallback(
    async (imageUrl: string): Promise<void> => {
      showDownloadProgress();

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `image_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        showDownloadResult({
          success: true,
          message: "이미지 다운로드가 완료되었습니다.",
        });
      } catch (error) {
        console.error("브라우저 이미지 다운로드 중 오류:", error);
        showDownloadResult({
          success: false,
          message: "이미지 다운로드 중 오류가 발생했습니다.",
        });
      }
    },
    [showDownloadProgress, showDownloadResult]
  );

  const downloadImage = useCallback(
    (imageUrl: string) => {
      if (!isNativeDownloadAvailable()) {
        downloadImageInBrowser(imageUrl).catch((error) => {
          console.error("브라우저 이미지 다운로드 실패:", error);
        });
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
    [isNativeDownloadAvailable, downloadImageInBrowser, showDownloadResult]
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
