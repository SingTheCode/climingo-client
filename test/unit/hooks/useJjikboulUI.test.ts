import { renderHook, act } from "@testing-library/react";
import useJjikboulUI from "@/hooks/jjikboul/useJjikboulUI";
import { ShareParams, WebkitNamespace } from "@/types/appScheme";

const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

const mockAlert = jest.fn();
global.alert = mockAlert;

const mockPrint = jest.fn();
Object.assign(window, {
  print: mockPrint,
});

const mockPostMessage = jest.fn<void, [ShareParams]>();

const originalUserAgent = navigator.userAgent;

describe("useJjikboulUI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
  });

  describe("showAlert", () => {
    test("alert 함수를 호출한다", () => {
      const { result } = renderHook(() => useJjikboulUI());

      act(() => {
        result.current.showAlert("테스트 메시지");
      });

      expect(mockAlert).toHaveBeenCalledWith("테스트 메시지");
    });
  });

  describe("copyToClipboard", () => {
    test("클립보드에 텍스트를 복사한다", async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useJjikboulUI());

      await act(async () => {
        await result.current.copyToClipboard("테스트 텍스트");
      });

      expect(mockWriteText).toHaveBeenCalledWith("테스트 텍스트");
    });
  });

  describe("printWindow", () => {
    test("window.print를 호출한다", () => {
      const { result } = renderHook(() => useJjikboulUI());

      act(() => {
        result.current.printWindow();
      });

      expect(mockPrint).toHaveBeenCalled();
    });
  });

  describe("handleShare", () => {
    describe("네이티브 앱 공유가 가능한 경우", () => {
      beforeEach(() => {
        const mockWebkit: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: mockPostMessage },
          },
        };
        Object.assign(window, { webkit: mockWebkit });
      });

      test("웹킷 메시지 핸들러로 공유 데이터를 전송한다", async () => {
        const { result } = renderHook(() => useJjikboulUI());

        await act(async () => {
          await result.current.handleShare("https://example.com");
        });

        expect(mockPostMessage).toHaveBeenCalledWith({
          url: "https://example.com",
          title: "찍볼 공유",
          text: "찍볼을 확인해보세요!",
        });
        expect(mockWriteText).not.toHaveBeenCalled();
        expect(mockAlert).not.toHaveBeenCalled();
      });

      test("웹킷 공유 중 오류 발생 시 useAppScheme에서 에러를 처리한다", async () => {
        const consoleErrorSpy = jest
          .spyOn(console, "error")
          .mockImplementation();
        mockPostMessage.mockImplementation(() => {
          throw new Error("웹킷 오류");
        });

        const { result } = renderHook(() => useJjikboulUI());

        await act(async () => {
          await result.current.handleShare("https://example.com");
        });

        // useAppScheme에서 에러를 내부적으로 처리하므로 에러 로그가 기록됨
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "공유 중 오류가 발생했습니다:",
          expect.any(Error)
        );
        // useJjikboulUI에서는 성공적으로 처리된 것으로 보이므로 alert가 호출되지 않음
        expect(mockAlert).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });
    });

    describe("네이티브 앱 공유가 불가능한 경우", () => {
      test("성공적으로 URL을 클립보드에 복사하고 알림을 보여준다", async () => {
        mockWriteText.mockResolvedValue(undefined);
        const { result } = renderHook(() => useJjikboulUI());

        await act(async () => {
          await result.current.handleShare("https://example.com");
        });

        expect(mockWriteText).toHaveBeenCalledWith("https://example.com");
        expect(mockAlert).toHaveBeenCalledWith(
          "링크가 클립보드에 복사되었습니다."
        );
        expect(mockPostMessage).not.toHaveBeenCalled();
      });

      test("클립보드 복사 실패 시 에러 메시지를 보여준다", async () => {
        const consoleErrorSpy = jest
          .spyOn(console, "error")
          .mockImplementation();
        mockWriteText.mockRejectedValue(new Error("클립보드 오류"));
        const { result } = renderHook(() => useJjikboulUI());

        await act(async () => {
          await result.current.handleShare("https://example.com");
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "❌ handleShare 에러:",
          expect.any(Error)
        );
        expect(mockAlert).toHaveBeenCalledWith(
          "공유 링크 복사에 실패했습니다."
        );

        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe("handleSaveAsImage", () => {
    test("모바일 기기에서 스크린샷 안내를 보여준다", () => {
      // Mock mobile user agent (use Android to match /Mobi|Android/i pattern)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36",
        configurable: true,
      });

      const { result } = renderHook(() => useJjikboulUI());

      act(() => {
        result.current.handleSaveAsImage();
      });

      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("화면을 스크린샷으로 저장해주세요")
      );
      expect(mockPrint).not.toHaveBeenCalled();
    });

    test("데스크톱에서 프린트 창을 연다", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        configurable: true,
      });

      const { result } = renderHook(() => useJjikboulUI());

      act(() => {
        result.current.handleSaveAsImage();
      });

      expect(mockPrint).toHaveBeenCalled();
    });
  });

  describe("isShareAvailable", () => {
    test("navigator.share가 있으면 true를 반환한다", () => {
      navigator.share = jest.fn();

      const { result } = renderHook(() => useJjikboulUI());

      const isAvailable = result.current.isShareAvailable();

      expect(isAvailable).toBe(true);
    });

    test("navigator.share가 없으면 false를 반환한다", () => {
      // @ts-expect-error - 테스트를 위한 navigator mock
      delete navigator.share;

      const { result } = renderHook(() => useJjikboulUI());

      const isAvailable = result.current.isShareAvailable();

      expect(isAvailable).toBe(false);
    });
  });

  describe("isMobileDevice", () => {
    test.each([
      "Mozilla/5.0 (Mobile; rv:26.0) Gecko/26.0 Firefox/26.0", // Contains "Mobi"
      "Mozilla/5.0 (Linux; Android 10; SM-G975F)", // Contains "Android"
      "Mozilla/5.0 (Android 4.4.2; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0", // Contains both
    ])("모바일 User Agent에서 true를 반환한다: %s", (userAgent) => {
      Object.defineProperty(navigator, "userAgent", {
        value: userAgent,
        configurable: true,
      });

      const { result } = renderHook(() => useJjikboulUI());

      expect(result.current.isMobileDevice()).toBe(true);
    });

    test.each([
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ])("데스크톱 User Agent에서 false를 반환한다: %s", (userAgent) => {
      Object.defineProperty(navigator, "userAgent", {
        value: userAgent,
        configurable: true,
      });

      const { result } = renderHook(() => useJjikboulUI());

      expect(result.current.isMobileDevice()).toBe(false);
    });
  });
});
