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
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

const renderUseImageDownloadHook = () => {
  const container =
    document.getElementById("test-container") || document.createElement("div");
  return renderHook(() => useImageDownload(), { container });
};

describe("이미지 다운로드 기능 (useImageDownload)", () => {
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("네이티브 다운로드 기능 감지", () => {
    describe("네이티브 앱 환경에서 이미지 다운로드 기능 가용성을 확인할 때", () => {
      test("네이티브 앱에서 다운로드 messageHandler가 설정된 상태일 때, 다운로드 기능 가용성을 확인하면, 사용 가능한 것으로 판단한다", () => {
        const nativeAppEnvironment: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: jest.fn() },
            downloadImage: { postMessage: mockDownloadPostMessage },
          },
        };
        Object.assign(window, { webkit: nativeAppEnvironment });
        const { result } = renderUseImageDownloadHook();

        const isAvailable = result.current.isNativeDownloadAvailable();

        expect(isAvailable).toBe(true);
      });

      test("웹 브라우저 환경일 때, 다운로드 기능 가용성을 확인하면, 사용 불가능한 것으로 판단한다", () => {
        const { result } = renderUseImageDownloadHook();

        const isAvailable = result.current.isNativeDownloadAvailable();

        expect(isAvailable).toBe(false);
      });

      test("네이티브 앱이지만 다운로드 기능이 지원되지 않을 때, 다운로드 기능 가용성을 확인하면, 사용 불가능한 것으로 판단한다", () => {
        const incompleteNativeEnvironment = {
          messageHandlers: {
            share: { postMessage: jest.fn() },
          },
        };
        Object.assign(window, { webkit: incompleteNativeEnvironment });
        const { result } = renderUseImageDownloadHook();

        const isAvailable = result.current.isNativeDownloadAvailable();

        expect(isAvailable).toBe(false);
      });
    });
  });

  describe("네이티브 앱 이미지 다운로드", () => {
    describe("네이티브 앱에서 이미지 다운로드를 실행할 때", () => {
      beforeEach(() => {
        const nativeAppEnvironment: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: jest.fn() },
            downloadImage: { postMessage: mockDownloadPostMessage },
          },
        };
        Object.assign(window, { webkit: nativeAppEnvironment });
      });

      test("유효한 이미지 URL이 있을 때, 다운로드를 실행하면, 네이티브 앱으로 다운로드 요청이 전달된다", () => {
        const { result } = renderUseImageDownloadHook();
        const validImageUrl = "https://example.com/image.jpg";

        act(() => {
          result.current.downloadImage(validImageUrl);
        });

        expect(mockDownloadPostMessage).toHaveBeenCalledWith({
          url: validImageUrl,
        });
      });

      test("다양한 형식의 이미지 URL들이 있을 때, 각각 다운로드를 실행하면, 모든 URL 형식이 네이티브 앱으로 전달된다", () => {
        const { result } = renderUseImageDownloadHook();
        const variousImageUrls = [
          "https://example.com/image.png",
          "http://example.com/image.gif",
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        ];

        variousImageUrls.forEach((url) => {
          act(() => {
            result.current.downloadImage(url);
          });

          expect(mockDownloadPostMessage).toHaveBeenCalledWith({ url });
        });
      });
    });

    describe("네이티브 다운로드 중 오류가 발생할 때", () => {
      beforeEach(() => {
        const faultyNativeEnvironment: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: jest.fn() },
            downloadImage: { postMessage: mockDownloadPostMessage },
          },
        };
        Object.assign(window, { webkit: faultyNativeEnvironment });

        mockDownloadPostMessage.mockImplementation(() => {
          throw new Error("네이티브 다운로드 오류");
        });
      });

      test("네이티브 다운로드 중 예외가 발생할 때, 다운로드를 시도하면, 오류가 적절히 처리되고 실패 결과가 표시된다", () => {
        const { result } = renderUseImageDownloadHook();

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
  });

  describe("브라우저 이미지 다운로드", () => {
    const mockFetch = jest.fn();
    const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
    const mockRevokeObjectURL = jest.fn();
    const mockLink = {
      href: "",
      download: "",
      click: jest.fn(),
    };
    const mockCreateElement = jest.fn(() => mockLink as never);
    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob(["test"], { type: "image/jpeg" })),
      });

      global.fetch = mockFetch as any;
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      mockLink.click.mockClear();
      document.createElement = mockCreateElement;
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;
    });

    describe("웹 브라우저에서 이미지 다운로드를 실행할 때", () => {
      test("네이티브 다운로드가 지원되지 않는 환경일 때, 이미지 다운로드를 실행하면, 브라우저 다운로드 방식으로 이미지가 다운로드된다", async () => {
        const { result } = renderUseImageDownloadHook();
        const imageUrl = "https://example.com/image.jpg";

        await act(async () => {
          result.current.downloadImage(imageUrl);
        });

        expect(mockFetch).toHaveBeenCalledWith(imageUrl);
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith("a");
      });

      test("브라우저에서 다운로드할 때, 다운로드가 성공적으로 완료되면, 성공 상태와 메시지가 표시된다", async () => {
        const { result } = renderUseImageDownloadHook();

        await act(async () => {
          result.current.downloadImage("https://example.com/image.jpg");
        });

        expect(result.current.isDownloading).toBe(false);
        expect(result.current.downloadResult).toEqual({
          success: true,
          message: "이미지 다운로드가 완료되었습니다.",
        });
      }, 10000);
    });

    test("브라우저 다운로드 중 fetch 오류 시 에러를 처리한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderUseImageDownloadHook();

      await act(async () => {
        result.current.downloadImage("https://example.com/invalid-image.jpg");
      });

      expect(result.current.downloadResult).toEqual({
        success: false,
        message: "이미지 다운로드 중 오류가 발생했습니다.",
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        "브라우저 이미지 다운로드 중 오류:",
        expect.any(Error)
      );
    });

    test("브라우저 다운로드 중 네트워크 오류 시 에러를 처리한다", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderUseImageDownloadHook();

      await act(async () => {
        result.current.downloadImage("https://example.com/image.jpg");
      });

      expect(result.current.downloadResult).toEqual({
        success: false,
        message: "이미지 다운로드 중 오류가 발생했습니다.",
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        "브라우저 이미지 다운로드 중 오류:",
        expect.any(Error)
      );
    });

    test("postMessage는 호출되지 않는다", async () => {
      const { result } = renderUseImageDownloadHook();

      await act(async () => {
        result.current.downloadImage("https://example.com/image.jpg");
      });

      expect(mockDownloadPostMessage).not.toHaveBeenCalled();
    });
  });
});

describe("다운로드 진행 상태 관리", () => {
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("초기 상태가 올바르게 설정된다", () => {
    const { result } = renderUseImageDownloadHook();

    expect(result.current.isDownloading).toBe(false);
    expect(result.current.downloadResult).toBeNull();
  });

  test("hideDownloadProgress가 isDownloading을 false로 설정한다", () => {
    const { result } = renderUseImageDownloadHook();

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
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("성공 결과가 올바르게 표시된다", () => {
    const { result } = renderUseImageDownloadHook();
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
    const { result } = renderUseImageDownloadHook();
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
    const { result } = renderUseImageDownloadHook();
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
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("마운트 시 핸들러가 등록된다", () => {
    renderUseImageDownloadHook();

    expect(window.onImageDownloadStart).toBeDefined();
  });

  test("다운로드 시작 시 진행 상태가 표시된다", () => {
    const { result } = renderUseImageDownloadHook();

    act(() => {
      if (window.onImageDownloadStart) {
        window.onImageDownloadStart();
      }
    });

    expect(result.current.isDownloading).toBe(true);
    expect(result.current.downloadResult).toBeNull();
  });

  test("30초 타임아웃이 설정된다", () => {
    const { result } = renderUseImageDownloadHook();

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
    const { result } = renderUseImageDownloadHook();

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
    const { unmount } = renderUseImageDownloadHook();

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
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("마운트 시 핸들러가 등록된다", () => {
    renderUseImageDownloadHook();

    expect(window.onImageDownloadComplete).toBeDefined();
  });

  test("다운로드 완료 시 타임아웃이 정리된다", () => {
    const { result } = renderUseImageDownloadHook();

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
    const { unmount } = renderUseImageDownloadHook();

    unmount();

    expect(window.onImageDownloadComplete).toBeUndefined();
  });
});

describe("엣지 케이스", () => {
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("다운로드 중 컴포넌트 언마운트 시 정리가 올바르게 수행된다", () => {
    const { result, unmount } = renderUseImageDownloadHook();

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

    const { result } = renderUseImageDownloadHook();

    act(() => {
      result.current.downloadImage("");
    });

    expect(mockDownloadPostMessage).toHaveBeenCalledWith({ url: "" });
  });

  test("여러 다운로드 결과가 빠르게 연속으로 와도 올바르게 처리된다", () => {
    const { result } = renderUseImageDownloadHook();

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
  beforeEach(() => {
    mockDownloadPostMessage.mockClear();
    mockConsoleError.mockClear();
    jest.useFakeTimers();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
    delete window.onImageDownloadStart;
    delete window.onImageDownloadComplete;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test("전체 다운로드 플로우가 올바르게 동작한다", () => {
    const mockWebkit: WebkitNamespace = {
      messageHandlers: {
        share: { postMessage: jest.fn() },
        downloadImage: { postMessage: mockDownloadPostMessage },
      },
    };
    Object.assign(window, { webkit: mockWebkit });

    const { result } = renderUseImageDownloadHook();
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
