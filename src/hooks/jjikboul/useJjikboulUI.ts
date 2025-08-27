import { useCallback } from "react";

import useAppScheme from "@/hooks/useAppScheme";

const useJjikboulUI = () => {
  const { share, isNativeShareAvailable } = useAppScheme();

  const showAlert = useCallback((message: string): void => {
    alert(message);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const printWindow = useCallback((): void => {
    window.print();
  }, []);

  const showScreenshotGuide = useCallback((): void => {
    const message =
      "화면을 스크린샷으로 저장해주세요.\n\niOS: 전원 버튼 + 홈 버튼 (또는 볼륨 상단 버튼)\nAndroid: 전원 버튼 + 볼륨 하단 버튼";
    showAlert(message);
  }, [showAlert]);

  const handleShare = useCallback(
    async (url: string) => {
      try {
        if (isNativeShareAvailable()) {
          share({
            url,
            title: "찍볼 공유",
            text: "찍볼을 확인해보세요!",
          });
          return;
        }

        await copyToClipboard(url);
        showAlert("링크가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("❌ handleShare 에러:", error);
        showAlert("공유 링크 복사에 실패했습니다.");
      }
    },
    [isNativeShareAvailable, share, copyToClipboard, showAlert]
  );

  const handleSaveAsImage = useCallback(() => {
    try {
      if (isMobileDevice()) {
        showScreenshotGuide();
      } else {
        printWindow();
      }
    } catch (error) {
      console.error("이미지 저장 안내 실패:", error);
      showAlert("스크린샷으로 저장해주세요.");
    }
  }, [showScreenshotGuide, printWindow, showAlert]);

  const isShareAvailable = useCallback((): boolean => {
    return typeof navigator !== "undefined" && "share" in navigator;
  }, []);

  const isMobileDevice = useCallback((): boolean => {
    return /Mobi|Android/i.test(navigator.userAgent);
  }, []);

  return {
    showAlert,
    copyToClipboard,
    printWindow,
    showScreenshotGuide,
    handleShare,
    handleSaveAsImage,
    isShareAvailable,
    isMobileDevice,
  };
};

export default useJjikboulUI;
