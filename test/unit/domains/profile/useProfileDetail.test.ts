import { renderHook, act } from "@testing-library/react";

import type { Profile } from "@/domains/profile/types/entity";

import { useProfileDetail } from "@/domains/profile/hooks/useProfileDetail";

describe("useProfileDetail Hook", () => {
  const mockProfile: Profile = {
    memberId: 1,
    nickname: "테스트유저",
    providerType: "kakao",
    profileUrl: "https://example.com/profile.jpg",
    email: "test@example.com",
    physicalInfo: {
      weight: 70,
      height: 175,
      armSpan: 180,
    },
  };

  describe("신체 정보 상태 관리", () => {
    test("초기 프로필 데이터로 상태가 초기화된다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      expect(result.current.weight).toBe(70);
      expect(result.current.height).toBe(175);
      expect(result.current.armSpan).toBe(180);
    });

    test("신체 정보가 없는 프로필일 때, undefined로 초기화된다", () => {
      const profileWithoutBody: Profile = {
        ...mockProfile,
        physicalInfo: undefined,
      };

      const { result } = renderHook(() => useProfileDetail(profileWithoutBody));

      expect(result.current.weight).toBeUndefined();
      expect(result.current.height).toBeUndefined();
      expect(result.current.armSpan).toBeUndefined();
    });
  });

  describe("신체 정보 수정", () => {
    test("몸무게를 수정하면 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      act(() => {
        result.current.setWeight(65);
      });

      expect(result.current.weight).toBe(65);
    });

    test("키를 수정하면 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      act(() => {
        result.current.setHeight(180);
      });

      expect(result.current.height).toBe(180);
    });

    test("팔길이를 수정하면 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      act(() => {
        result.current.setArmSpan(185);
      });

      expect(result.current.armSpan).toBe(185);
    });
  });

  describe("변경 여부 감지", () => {
    test("값이 변경되지 않으면 hasChanges는 false이다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      expect(result.current.hasChanges).toBe(false);
    });

    test("값이 변경되면 hasChanges는 true이다", () => {
      const { result } = renderHook(() => useProfileDetail(mockProfile));

      act(() => {
        result.current.setWeight(65);
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });
});
