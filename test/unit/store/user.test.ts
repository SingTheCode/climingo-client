import { renderHook, act } from "@testing-library/react";

import useUserStore from "@/store/user";
import type { MemberInfo } from "@/types/auth";

// localStorage 모킹
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("사용자 스토어 (useUserStore)", () => {
  beforeEach(() => {
    act(() => {
      useUserStore.setState({ user: null });
    });
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("사용자 정보 관리", () => {
    test("사용자 정보를 설정하면 스토어 상태가 업데이트되고 localStorage에 저장된다", () => {
      const mockUser: MemberInfo = {
        nickname: "테스트사용자",
        profileUrl: "https://example.com/test.jpg",
        memberId: 1,
        email: "test@example.com",
        providerType: "kakao",
      };

      const { result } = renderHook(() =>
        useUserStore((state) => state.setUser)
      );

      act(() => {
        result.current(mockUser);
      });

      expect(useUserStore.getState().user).toEqual(mockUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "memberInfo",
        JSON.stringify(mockUser)
      );
    });

    test("사용자 정보를 삭제하면 스토어 상태가 초기화되고 localStorage에서 제거된다", () => {
      const mockUser: MemberInfo = {
        nickname: "삭제테스트",
        profileUrl: "https://example.com/clear.jpg",
        memberId: 2,
        email: "clear@example.com",
        providerType: "apple",
      };

      act(() => {
        useUserStore.getState().setUser(mockUser);
      });

      const { result } = renderHook(() =>
        useUserStore((state) => state.clearUser)
      );

      act(() => {
        result.current();
      });

      expect(useUserStore.getState().user).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("memberInfo");
    });
  });

  describe("사용자 정보 조회", () => {
    test("스토어에서 사용자 정보를 조회할 수 있다", () => {
      const mockUser: MemberInfo = {
        nickname: "조회테스트",
        profileUrl: "https://example.com/get.jpg",
        memberId: 3,
        email: "get@example.com",
        providerType: "kakao",
      };

      act(() => {
        useUserStore.getState().setUser(mockUser);
      });

      const { result } = renderHook(() => useUserStore((state) => state.user));

      expect(result.current).toEqual(mockUser);
    });
  });

  describe("localStorage 처리", () => {
    test("localStorage에 잘못된 JSON이 있으면 사용자 정보가 null로 초기화된다", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const { result } = renderHook(() => useUserStore((state) => state.user));

      expect(result.current).toBeNull();
    });

    test("localStorage에 유효한 사용자 정보가 있으면 스토어 초기화 시 자동으로 로드된다", async () => {
      const mockUser: MemberInfo = {
        nickname: "로드테스트",
        profileUrl: "https://example.com/load.jpg",
        memberId: 4,
        email: "load@example.com",
        providerType: "kakao",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      jest.resetModules();
      const { default: freshUserStore } = await import("@/store/user");

      expect(freshUserStore.getState().user).toEqual(mockUser);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("memberInfo");
    });
  });
});
