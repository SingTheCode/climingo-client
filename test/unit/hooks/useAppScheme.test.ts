import { renderHook } from "@testing-library/react";
import useAppScheme from "@/hooks/useAppScheme";
import { ShareParams, WebkitNamespace } from "@/types/appScheme";

const mockPostMessage = jest.fn<void, [ShareParams]>();

describe("useAppScheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
  });

  describe("네이티브 공유 기능 가능 여부", () => {
    test("webkit.messageHandlers.share가 있으면 true를 반환한다", () => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: mockPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });

      const { result } = renderHook(() => useAppScheme());

      expect(result.current.isNativeShareAvailable()).toBe(true);
    });

    test("webkit.messageHandlers.share가 없으면 false를 반환한다", () => {
      const { result } = renderHook(() => useAppScheme());

      expect(result.current.isNativeShareAvailable()).toBe(false);
    });
  });

  describe("share 함수 - string 타입", () => {
    beforeEach(() => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: mockPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });
    });

    test("단순 문자열을 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());

      result.current.share("Hello World");

      expect(mockPostMessage).toHaveBeenCalledWith("Hello World");
    });

    test("빈 문자열도 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());

      result.current.share("");

      expect(mockPostMessage).toHaveBeenCalledWith("");
    });
  });

  describe("share 함수 - 객체 타입", () => {
    beforeEach(() => {
      const mockWebkit: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: mockPostMessage },
        },
      };
      Object.assign(window, { webkit: mockWebkit });
    });

    test("URL 만 있는 객체를 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());
      const shareData = { url: "https://example.com" };

      result.current.share(shareData);

      expect(mockPostMessage).toHaveBeenCalledWith(shareData);
    });

    test("URL 과 text 가 있는 객체를 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());
      const shareData = {
        text: "Check this out!",
        url: "https://example.com",
      };

      result.current.share(shareData);

      expect(mockPostMessage).toHaveBeenCalledWith(shareData);
    });

    test("title, text, URL 이 모두 있는 객체를 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());
      const shareData = {
        title: "Amazing App",
        text: "Check this out!",
        url: "https://example.com",
      };

      result.current.share(shareData);

      expect(mockPostMessage).toHaveBeenCalledWith(shareData);
    });

    test("title 과 URL 만 있는 객체를 공유할 수 있다", () => {
      const { result } = renderHook(() => useAppScheme());
      const shareData = {
        title: "Amazing App",
        url: "https://example.com",
      };

      result.current.share(shareData);

      expect(mockPostMessage).toHaveBeenCalledWith(shareData);
    });
  });

  describe("네이티브 공유 기능이 없을 때", () => {
    test("postMessage 가 호출되지 않는다", () => {
      const { result } = renderHook(() => useAppScheme());

      result.current.share("Hello World");
      result.current.share({ url: "https://example.com" });

      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });
});
