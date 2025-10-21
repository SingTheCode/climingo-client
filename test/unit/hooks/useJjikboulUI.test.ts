import { renderHook, act } from "@testing-library/react";
import useJjikboulUI from "@/hooks/jjikboul/useJjikboulUI";
import { WebkitNamespace } from "@/types/appScheme";

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

const originalUserAgent = navigator.userAgent;

describe("useJjikboulUI Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
  });

  describe("Feature: 클립보드 복사 기능", () => {
    describe("사용자가 텍스트를 클립보드에 복사하려고 할 때", () => {
      describe("클립보드 API가 정상적으로 작동하는 경우", () => {
        test("텍스트가 클립보드에 복사되어야 한다", async () => {
          mockWriteText.mockResolvedValue(undefined);
          const { result } = renderHook(() => useJjikboulUI());
          const testText = "테스트 텍스트";

          await act(async () => {
            await result.current.copyToClipboard(testText);
          });

          expect(mockWriteText).toHaveBeenCalledWith(testText);
          expect(mockWriteText).toHaveBeenCalledTimes(1);
        });
      });

      describe("클립보드 API가 실패하는 경우", () => {
        test("에러가 발생해야 한다", async () => {
          const errorMessage = "클립보드 접근 권한이 없습니다";
          mockWriteText.mockRejectedValue(new Error(errorMessage));
          const { result } = renderHook(() => useJjikboulUI());

          await expect(async () => {
            await act(async () => {
              await result.current.copyToClipboard("테스트");
            });
          }).rejects.toThrow(errorMessage);
        });
      });

      describe("빈 문자열을 복사하려고 하는 경우", () => {
        test("빈 문자열이 클립보드에 복사되어야 한다", async () => {
          mockWriteText.mockResolvedValue(undefined);
          const { result } = renderHook(() => useJjikboulUI());

          await act(async () => {
            await result.current.copyToClipboard("");
          });

          expect(mockWriteText).toHaveBeenCalledWith("");
        });
      });

      describe("특수 문자가 포함된 텍스트를 복사하는 경우", () => {
        test("특수 문자가 포함된 텍스트가 정확히 복사되어야 한다", async () => {
          mockWriteText.mockResolvedValue(undefined);
          const { result } = renderHook(() => useJjikboulUI());
          const specialText =
            "https://example.com/share?id=123&param=찍볼#section";

          await act(async () => {
            await result.current.copyToClipboard(specialText);
          });

          expect(mockWriteText).toHaveBeenCalledWith(specialText);
        });
      });
    });
  });

  describe("Feature: 네이티브 공유 기능 감지", () => {
    describe("사용자가 네이티브 공유 기능 사용 가능 여부를 확인하려고 할 때", () => {
      describe("navigator.share API가 지원되는 환경인 경우", () => {
        test("true를 반환해야 한다", () => {
          navigator.share = jest.fn();
          const { result } = renderHook(() => useJjikboulUI());

          const isAvailable = result.current.isShareAvailable();

          expect(isAvailable).toBe(true);
        });
      });

      describe("navigator.share API가 지원되지 않는 환경인 경우", () => {
        test("false를 반환해야 한다", () => {
          // @ts-expect-error - 테스트를 위한 navigator mock
          delete navigator.share;

          const { result } = renderHook(() => useJjikboulUI());

          const isAvailable = result.current.isShareAvailable();

          expect(isAvailable).toBe(false);
        });
      });

      describe("navigator가 undefined인 경우", () => {
        test("false를 반환해야 한다", () => {
          const originalNavigator = global.navigator;
          // @ts-expect-error - 테스트를 위한 navigator mock
          delete global.navigator;
          const { result } = renderHook(() => useJjikboulUI());

          const isAvailable = result.current.isShareAvailable();

          expect(isAvailable).toBe(false);

          // Cleanup
          global.navigator = originalNavigator;
        });
      });
    });
  });

  describe("Feature: 모바일 디바이스 감지", () => {
    describe("사용자가 모바일 디바이스인지 확인하려고 할 때", () => {
      describe("모바일 User Agent를 사용하는 경우", () => {
        const mobileUserAgents = [
          {
            userAgent: "Mozilla/5.0 (Mobile; rv:26.0) Gecko/26.0 Firefox/26.0",
            description: "Firefox Mobile (Mobi 패턴)",
          },
          {
            userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F)",
            description: "Android 디바이스",
          },
          {
            userAgent:
              "Mozilla/5.0 (Android 4.4.2; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
            description: "Android + Mobile 조합",
          },
          {
            userAgent:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
            description: "iPhone Safari (Mobile 포함)",
          },
        ];

        test.each(mobileUserAgents)(
          "true를 반환해야 한다 - $description",
          ({ userAgent }) => {
            Object.defineProperty(navigator, "userAgent", {
              value: userAgent,
              configurable: true,
            });
            const { result } = renderHook(() => useJjikboulUI());

            const isMobile = result.current.isMobileDevice();

            expect(isMobile).toBe(true);
          }
        );
      });

      describe("데스크톱 User Agent를 사용하는 경우", () => {
        const desktopUserAgents = [
          {
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            description: "Windows 데스크톱",
          },
          {
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            description: "macOS 데스크톱",
          },
          {
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            description: "Linux 데스크톱",
          },
        ];

        test.each(desktopUserAgents)(
          "false를 반환해야 한다 - $description",
          ({ userAgent }) => {
            Object.defineProperty(navigator, "userAgent", {
              value: userAgent,
              configurable: true,
            });
            const { result } = renderHook(() => useJjikboulUI());

            const isMobile = result.current.isMobileDevice();

            expect(isMobile).toBe(false);
          }
        );
      });

      describe("User Agent가 비정상적인 값인 경우", () => {
        test("빈 문자열일 때 false를 반환해야 한다", () => {
          Object.defineProperty(navigator, "userAgent", {
            value: "",
            configurable: true,
          });
          const { result } = renderHook(() => useJjikboulUI());

          const isMobile = result.current.isMobileDevice();

          expect(isMobile).toBe(false);
        });

        test("undefined일 때 false를 반환해야 한다", () => {
          Object.defineProperty(navigator, "userAgent", {
            value: undefined,
            configurable: true,
          });
          const { result } = renderHook(() => useJjikboulUI());

          const isMobile = result.current.isMobileDevice();

          expect(isMobile).toBe(false);
        });
      });
    });
  });

  describe("Feature: Hook 안정성 및 메모이제이션", () => {
    describe("Hook이 여러 번 렌더링되는 경우", () => {
      describe("동일한 props로 리렌더링되는 경우", () => {
        test("모든 함수가 동일한 참조를 유지해야 한다", () => {
          const { result, rerender } = renderHook(() => useJjikboulUI());
          const firstRender = {
            copyToClipboard: result.current.copyToClipboard,
            isShareAvailable: result.current.isShareAvailable,
            isMobileDevice: result.current.isMobileDevice,
          };

          rerender();

          expect(result.current.copyToClipboard).toBe(
            firstRender.copyToClipboard
          );
          expect(result.current.isShareAvailable).toBe(
            firstRender.isShareAvailable
          );
          expect(result.current.isMobileDevice).toBe(
            firstRender.isMobileDevice
          );
        });
      });

      describe("연속적으로 같은 함수를 호출하는 경우", () => {
        test("모든 호출이 정상적으로 처리되어야 한다", async () => {
          mockWriteText.mockResolvedValue(undefined);
          const { result } = renderHook(() => useJjikboulUI());
          const testTexts = ["텍스트1", "텍스트2", "텍스트3"];

          for (const text of testTexts) {
            await act(async () => {
              await result.current.copyToClipboard(text);
            });
          }

          expect(mockWriteText).toHaveBeenCalledTimes(3);
          testTexts.forEach((text, index) => {
            expect(mockWriteText).toHaveBeenNthCalledWith(index + 1, text);
          });
        });
      });
    });
  });
});
