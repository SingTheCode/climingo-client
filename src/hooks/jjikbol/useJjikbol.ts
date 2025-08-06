import { useCallback } from "react";

interface JjikbolData {
  jjikbol: {
    id: string;
    problemType: string;
    description: string;
    createdDate: string;
  };
  memberInfo: {
    id: string;
    nickname: string;
    profileUrl: string;
  };
  gym: {
    gymId: string;
    gymName: string;
  };
  level: {
    levelId: string;
    colorNameKo: string;
    colorNameEn: string;
  };
}

const useJjikbol = () => {
  const shareToNative = useCallback(async (data: JjikbolData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `찍볼 - ${data.gym.gymName} ${data.level.colorNameKo}`,
          text: `${data.memberInfo.nickname}님이 만든 찍볼 문제를 확인해보세요!\n\n${data.jjikbol.description}`,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
          // Fallback: 클립보드에 URL 복사
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 클립보드에 복사되었습니다.");
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  }, []);

  const saveAsImage = useCallback(async () => {
    try {
      // 모바일에서는 스크린샷 안내 메시지
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        alert(
          "화면을 스크린샷으로 저장해주세요.\n\niOS: 전원 버튼 + 홈 버튼 (또는 볼륨 상단 버튼)\nAndroid: 전원 버튼 + 볼륨 하단 버튼"
        );
      } else {
        // 데스크톱에서는 인쇄 다이얼로그 열기
        window.print();
      }
    } catch (error) {
      console.error("이미지 저장 안내 실패:", error);
      alert("스크린샷으로 저장해주세요.");
    }
  }, []);

  const isShareAvailable =
    typeof navigator !== "undefined" && !!navigator.share;

  return {
    shareToNative,
    saveAsImage,
    isShareAvailable,
  };
};

export default useJjikbol;
