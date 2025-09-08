import { renderHook, act } from "@testing-library/react";
import useImageDownload from "@/hooks/useImageDownload";
import {
  ImageDownloadParams,
  WebkitNamespace,
  ImageDownloadResult,
} from "@/types/appScheme";

// 테스트용 Window 타입 확장
declare global {
  interface Window {
    onImageDownloadStart?: () => void;
    onImageDownloadComplete?: (result: ImageDownloadResult) => void;
  }
}

const mockDownloadPostMessage = jest.fn<void, [ImageDownloadParams]>();
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("useImageDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("isNativeDownloadAvailable", () => {
    test("webkit.messageHandlers.downloadImage가 있으면 true를 반환한다", () => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: jest.fn() },
          downloadImage: { postMessage: mockDownloadPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });

      const { result } = renderHook(() => useImageDownload());

      expect(result.current.isNativeDownloadAvailable()).toBe(true);
    });

    test("webkit이 없으면 false를 반환한다", () => {
      const { result } = renderHook(() => useImageDownload());

      expect(result.current.isNativeDownloadAvailable()).toBe(false);
    });

    test("webkit이 있지만 downloadImage 핸들러가 없으면 false를 반환한다", () => {
      const mockWebkit = {
        messageHandlers: {
          share: { postMessage: jest.fn() },
        },
      };
      Object.assign(window, { webkit: mockWebkit });

      const { result } = renderHook(() => useImageDownload());

      expect(result.current.isNativeDownloadAvailable()).toBe(false);
    });
  });

  describe("downloadImage", () => {
    describe("네이티브 다운로드가 가능한 경우", () => {
      beforeEach(() => {
        const mockWebkit: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: jest.fn() },
            downloadImage: { postMessage: mockDownloadPostMessage },
          },
        };
        Object.assign(window, { webkit: mockWebkit });
      });

      test("유효한 URL로 postMessage를 호출한다", () => {
        const { result } = renderHook(() => useImageDownload());
        const imageUrl = "https://example.com/image.jpg";

        act(() => {
          result.current.downloadImage(imageUrl);
        });

        expect(mockDownloadPostMessage).toHaveBeenCalledWith({
          url: imageUrl,
        });
      });

      test("다양한 URL 형식을 처리할 수 있다", () => {
        const { result } = renderHook(() => useImageDownload());

        const urls = [
          "https://example.com/image.png",
          "http://example.com/image.gif",
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        ];

        urls.forEach((url) => {
          act(() => {
            result.current.downloadImage(url);
          });

          expect(mockDownloadPostMessage).toHaveBeenCalledWith({ url });
        });
      });

      test("postMessage 호출 중 오류 발생 시 에러를 처리한다", () => {
        mockDownloadPostMessage.mockImplementation(() => {
          throw new Error("네이티브 다운로드 오류");
        });

        const { result } = renderHook(() => useImageDownload());

        act(() => {
          result.current.downloadImage("https://example.com/image.jpg");
        });

        expect(mockConsoleError).toHaveBeenCalledWith(
          "이미지 다운로드 중 오류가 발생했습니다:",
          expect.any(Error)
        );
        expect(result.current.downloadResult).toEqual({
          success: false,
          message: "이미지 다운로드 중 오류가 발생했습니다.",
        });
        expect(result.current.isDownloading).toBe(false);
      });
    });

    describe("네이티브 다운로드가 불가능한 경우", () => {
      test("콘솔에 불가능 메시지를 기록하고 postMessage를 호출하지 않는다", () => {
        const { result } = renderHook(() => useImageDownload());

        act(() => {
          result.current.downloadImage("https://example.com/image.jpg");
        });

        expect(mockConsoleLog).toHaveBeenCalledWith(
          "네이티브 이미지 다운로드 기능을 사용할 수 없습니다."
        );
        expect(mockDownloadPostMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe("다운로드 진행 상태 관리", () => {
    test("초기 상태가 올바르게 설정된다", () => {
      const { result } = renderHook(() => useImageDownload());

      expect(result.current.isDownloading).toBe(false);
      expect(result.current.downloadResult).toBeNull();
    });

    test("hideDownloadProgress가 isDownloading을 false로 설정한다", () => {
      const { result } = renderHook(() => useImageDownload());

      // 먼저 다운로드 진행 상태를 true로 설정
      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      expect(result.current.isDownloading).toBe(true);

      act(() => {
        result.current.hideDownloadProgress();
      });

      expect(result.current.isDownloading).toBe(false);
    });
  });

  describe("다운로드 결과 표시", () => {
    test("성공 결과가 올바르게 표시된다", () => {
      const { result } = renderHook(() => useImageDownload());
      const successResult: ImageDownloadResult = {
        success: true,
        message: "이미지가 성공적으로 다운로드되었습니다.",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(successResult);
        }
      });

      expect(result.current.downloadResult).toEqual(successResult);
      expect(result.current.isDownloading).toBe(false);
    });

    test("실패 결과가 올바르게 표시된다", () => {
      const { result } = renderHook(() => useImageDownload());
      const failureResult: ImageDownloadResult = {
        success: false,
        message: "이미지 다운로드에 실패했습니다.",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(failureResult);
        }
      });

      expect(result.current.downloadResult).toEqual(failureResult);
      expect(result.current.isDownloading).toBe(false);
    });

    test("다운로드 결과가 3초 후 자동으로 초기화된다", () => {
      const { result } = renderHook(() => useImageDownload());
      const successResult: ImageDownloadResult = {
        success: true,
        message: "다운로드 완료",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(successResult);
        }
      });

      expect(result.current.downloadResult).toEqual(successResult);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.downloadResult).toBeNull();
    });
  });

  describe("onImageDownloadStart 이벤트 핸들러", () => {
    test("마운트 시 핸들러가 등록된다", () => {
      renderHook(() => useImageDownload());

      expect(window.onImageDownloadStart).toBeDefined();
    });

    test("다운로드 시작 시 진행 상태가 표시된다", () => {
      const { result } = renderHook(() => useImageDownload());

      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      expect(result.current.isDownloading).toBe(true);
      expect(result.current.downloadResult).toBeNull();
    });

    test("30초 타임아웃이 설정된다", () => {
      const { result } = renderHook(() => useImageDownload());

      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      expect(result.current.isDownloading).toBe(true);

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(result.current.downloadResult).toEqual({
        success: false,
        message: "다운로드 시간이 초과되었습니다.",
      });
      expect(result.current.isDownloading).toBe(false);
    });

    test("연속 다운로드 시 이전 타임아웃이 정리된다", () => {
      const { result } = renderHook(() => useImageDownload());

      // 첫 번째 다운로드 시작
      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      // 15초 경과
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      // 두 번째 다운로드 시작 (이전 타임아웃 정리)
      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      // 추가 20초 경과 (총 35초이지만 두 번째 다운로드 시작부터는 20초)
      act(() => {
        jest.advanceTimersByTime(20000);
      });

      // 아직 타임아웃되지 않아야 함 (두 번째 다운로드 시작부터 30초가 되지 않음)
      expect(result.current.downloadResult).toBeNull();
      expect(result.current.isDownloading).toBe(true);
    });

    test("언마운트 시 핸들러와 타임아웃이 정리된다", () => {
      const { unmount } = renderHook(() => useImageDownload());

      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      unmount();

      expect(window.onImageDownloadStart).toBeUndefined();
    });
  });

  describe("onImageDownloadComplete 이벤트 핸들러", () => {
    test("마운트 시 핸들러가 등록된다", () => {
      renderHook(() => useImageDownload());

      expect(window.onImageDownloadComplete).toBeDefined();
    });

    test("다운로드 완료 시 타임아웃이 정리된다", () => {
      const { result } = renderHook(() => useImageDownload());

      // 다운로드 시작하여 타임아웃 설정
      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      // 다운로드 완료
      const result_data: ImageDownloadResult = {
        success: true,
        message: "다운로드 완료",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(result_data);
        }
      });

      expect(result.current.downloadResult).toEqual(result_data);

      // 30초 후에도 타임아웃 메시지로 덮어씌워지지 않아야 함
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // 3초의 자동 초기화 시간도 고려하면 결과는 null이어야 함
      expect(result.current.downloadResult).toBeNull();
    });

    test("언마운트 시 핸들러가 정리된다", () => {
      const { unmount } = renderHook(() => useImageDownload());

      unmount();

      expect(window.onImageDownloadComplete).toBeUndefined();
    });
  });

  describe("엣지 케이스", () => {
    test("다운로드 중 컴포넌트 언마운트 시 정리가 올바르게 수행된다", () => {
      const { result, unmount } = renderHook(() => useImageDownload());

      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      expect(result.current.isDownloading).toBe(true);

      unmount();

      expect(window.onImageDownloadStart).toBeUndefined();
      expect(window.onImageDownloadComplete).toBeUndefined();
    });

    test("빈 문자열 URL도 처리할 수 있다", () => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: jest.fn() },
          downloadImage: { postMessage: mockDownloadPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });

      const { result } = renderHook(() => useImageDownload());

      act(() => {
        result.current.downloadImage("");
      });

      expect(mockDownloadPostMessage).toHaveBeenCalledWith({ url: "" });
    });

    test("여러 다운로드 결과가 빠르게 연속으로 와도 올바르게 처리된다", () => {
      const { result } = renderHook(() => useImageDownload());

      const result1: ImageDownloadResult = {
        success: true,
        message: "첫 번째 다운로드 완료",
      };

      const result2: ImageDownloadResult = {
        success: false,
        message: "두 번째 다운로드 실패",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(result1);
        }
      });

      expect(result.current.downloadResult).toEqual(result1);

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(result2);
        }
      });

      expect(result.current.downloadResult).toEqual(result2);
    });
  });

  describe("통합 테스트", () => {
    test("전체 다운로드 플로우가 올바르게 동작한다", () => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: jest.fn() },
          downloadImage: { postMessage: mockDownloadPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });

      const { result } = renderHook(() => useImageDownload());
      const imageUrl = "https://example.com/image.jpg";

      // 1. 다운로드 시작
      act(() => {
        result.current.downloadImage(imageUrl);
      });

      expect(mockDownloadPostMessage).toHaveBeenCalledWith({ url: imageUrl });

      // 2. 다운로드 진행 상태 시작
      act(() => {
        if (window.onImageDownloadStart) {
          window.onImageDownloadStart();
        }
      });

      expect(result.current.isDownloading).toBe(true);
      expect(result.current.downloadResult).toBeNull();

      // 3. 다운로드 완료
      const successResult: ImageDownloadResult = {
        success: true,
        message: "다운로드가 완료되었습니다.",
      };

      act(() => {
        if (window.onImageDownloadComplete) {
          window.onImageDownloadComplete(successResult);
        }
      });

      expect(result.current.isDownloading).toBe(false);
      expect(result.current.downloadResult).toEqual(successResult);

      // 4. 3초 후 결과 자동 초기화
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.downloadResult).toBeNull();
    });
  });
});
