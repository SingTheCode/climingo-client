import { renderHook } from "@testing-library/react";
import useAppScheme from "@/hooks/useAppScheme";
import {
  ShareParams,
  WebkitNamespace,
  ImageDownloadParams,
} from "@/types/appScheme";

const mockPostMessage = jest.fn<void, [ShareParams]>();
const mockDownloadPostMessage = jest.fn<void, [ImageDownloadParams]>();

describe("네이티브 앱 연동 기능 (useAppScheme)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as Window & { webkit?: WebkitNamespace }).webkit;
  });

  describe("네이티브 공유 기능 감지", () => {
    describe("네이티브 앱 환경에서 공유 기능 가용성을 확인할 때", () => {
      test("네이티브 앱에서 webkit messageHandler가 설정된 상태일 때, 공유 기능 가용성을 확인하면, 사용 가능한 것으로 판단한다", () => {
        const nativeAppEnvironment: WebkitNamespace = {
          messageHandlers: {
            share: { postMessage: mockPostMessage },
            downloadImage: { postMessage: mockDownloadPostMessage },
          },
        };
        Object.assign(window, { webkit: nativeAppEnvironment });
        const { result } = renderHook(() => useAppScheme());

        const isAvailable = result.current.isNativeShareAvailable();

        expect(isAvailable).toBe(true);
      });

      test("웹 브라우저 환경일 때, 공유 기능 가용성을 확인하면, 사용 불가능한 것으로 판단한다", () => {
        const { result } = renderHook(() => useAppScheme());

        const isAvailable = result.current.isNativeShareAvailable();

        expect(isAvailable).toBe(false);
      });
    });
  });

  describe("문자열 콘텐츠 공유", () => {
    beforeEach(() => {
      const nativeAppEnvironment: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: mockPostMessage },
          downloadImage: { postMessage: mockDownloadPostMessage },
        },
      };
      Object.assign(window, { webkit: nativeAppEnvironment });
    });

    describe("사용자가 텍스트를 공유하려고 할 때", () => {
      test("공유할 텍스트가 있을 때, 텍스트 공유를 실행하면, 네이티브 앱으로 텍스트가 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const textToShare = "Hello World";

        result.current.share(textToShare);

        expect(mockPostMessage).toHaveBeenCalledWith(textToShare);
      });
    });

    describe("빈 콘텐츠를 공유하려고 할 때", () => {
      test("빈 문자열이 있을 때, 공유를 실행하면, 빈 문자열도 네이티브 앱으로 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const emptyText = "";

        result.current.share(emptyText);

        expect(mockPostMessage).toHaveBeenCalledWith(emptyText);
      });
    });
  });

  describe("구조화된 콘텐츠 공유", () => {
    beforeEach(() => {
      const nativeAppEnvironment: WebkitNamespace = {
        messageHandlers: {
          share: { postMessage: mockPostMessage },
          downloadImage: { postMessage: mockDownloadPostMessage },
        },
      };
      Object.assign(window, { webkit: nativeAppEnvironment });
    });

    describe("최소한의 공유 데이터로 링크를 공유할 때", () => {
      test("URL만 포함된 공유 데이터가 있을 때, 공유를 실행하면, 네이티브 앱으로 URL 데이터가 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const urlOnlyShareData = { url: "https://example.com" };

        result.current.share(urlOnlyShareData);

        expect(mockPostMessage).toHaveBeenCalledWith(urlOnlyShareData);
      });
    });

    describe("설명이 포함된 링크를 공유할 때", () => {
      test("URL과 설명 텍스트가 포함된 공유 데이터가 있을 때, 공유를 실행하면, 네이티브 앱으로 완전한 데이터가 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const urlWithTextShareData = {
          text: "Check this out!",
          url: "https://example.com",
        };

        result.current.share(urlWithTextShareData);

        expect(mockPostMessage).toHaveBeenCalledWith(urlWithTextShareData);
      });
    });

    describe("완전한 메타데이터와 함께 콘텐츠를 공유할 때", () => {
      test("제목, 설명, URL이 모두 포함된 공유 데이터가 있을 때, 공유를 실행하면, 네이티브 앱으로 풍부한 메타데이터가 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const completeShareData = {
          title: "Amazing App",
          text: "Check this out!",
          url: "https://example.com",
        };

        result.current.share(completeShareData);

        expect(mockPostMessage).toHaveBeenCalledWith(completeShareData);
      });

      test("제목과 URL만 포함된 공유 데이터가 있을 때, 공유를 실행하면, 네이티브 앱으로 제목과 URL이 전달된다", () => {
        const { result } = renderHook(() => useAppScheme());
        const titleWithUrlShareData = {
          title: "Amazing App",
          url: "https://example.com",
        };

        result.current.share(titleWithUrlShareData);

        expect(mockPostMessage).toHaveBeenCalledWith(titleWithUrlShareData);
      });
    });
  });

  describe("네이티브 공유 기능 미지원 환경 처리", () => {
    describe("웹 브라우저에서 네이티브 공유를 시도할 때", () => {
      test("네이티브 앱 환경이 아닐 때, 공유를 시도하면, 네이티브 메시지 전송이 수행되지 않는다", () => {
        const { result } = renderHook(() => useAppScheme());

        result.current.share("Hello World");
        result.current.share({ url: "https://example.com" });

        expect(mockPostMessage).not.toHaveBeenCalled();
      });
    });
  });
});
