import { useCallback } from "react";

import { ShareParams } from "@/types/appScheme";

const useAppScheme = () => {
  const isNativeShareAvailable = useCallback((): boolean => {
    return !!window.webkit?.messageHandlers?.share;
  }, []);

  const share = useCallback(
    (params: ShareParams): void => {
      if (!isNativeShareAvailable()) {
        console.log("네이티브 공유 기능을 사용할 수 없습니다.");
        return;
      }

      try {
        window.webkit!.messageHandlers.share.postMessage(params);
      } catch (error) {
        console.error("공유 중 오류가 발생했습니다:", error);
      }
    },
    [isNativeShareAvailable]
  );

  return {
    share,
    isNativeShareAvailable,
  };
};

export default useAppScheme;
