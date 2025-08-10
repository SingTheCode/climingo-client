import { useCallback } from "react";
import { useGetJjikboulDetailQuery } from "@/api/hooks/jjikboul";
import { JjikboulDetail } from "@/types/jjikboul";

const useJjikboul = (jjikboulId?: string) => {
  const jjikboulQuery = useGetJjikboulDetailQuery(jjikboulId || "");

  const shareToNative = useCallback(async (data: JjikboulDetail) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `찍볼 - ${data.gym.gymName} ${data.level.colorNameKo}`,
          text: `${data.memberInfo.nickname}님이 만든 찍볼 문제를 확인해보세요!\n\n${data.jjikboul.description}`,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 클립보드에 복사되었습니다.");
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  }, []);

  const saveAsImage = useCallback(async () => {
    try {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        alert(
          "화면을 스크린샷으로 저장해주세요.\n\niOS: 전원 버튼 + 홈 버튼 (또는 볼륨 상단 버튼)\nAndroid: 전원 버튼 + 볼륨 하단 버튼"
        );
      } else {
        window.print();
      }
    } catch (error) {
      console.error("이미지 저장 안내 실패:", error);
      alert("스크린샷으로 저장해주세요.");
    }
  }, []);

  const shareCurrentJjikboul = useCallback(async () => {
    if (jjikboulQuery.data) {
      await shareToNative(jjikboulQuery.data);
    }
  }, [jjikboulQuery.data, shareToNative]);

  const isShareAvailable =
    typeof navigator !== "undefined" && !!navigator.share;

  return {
    jjikboul: jjikboulQuery.data,
    isLoading: jjikboulQuery.isLoading,
    isError: jjikboulQuery.isError,
    shareToNative,
    shareCurrentJjikboul,
    saveAsImage,
    isShareAvailable,
  };
};

export default useJjikboul;
