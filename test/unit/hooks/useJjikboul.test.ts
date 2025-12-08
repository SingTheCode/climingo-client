import { renderHook } from "@testing-library/react";
import useJjikboul from "@/shared/hooks/jjikboul/useJjikboul";
import { JjikboulDetail } from "@/shared/types/jjikboul";

describe("찍볼 비즈니스로직 (useJjikboul)", () => {
  describe("찍볼 공유 URL 생성", () => {
    describe("사용자가 찍볼을 공유하려고 할 때", () => {
      test("사용자가 찍볼 페이지에 있을 때, 공유 URL을 요청하면, 현재 페이지의 URL을 반환한다", () => {
        const { result } = renderHook(() => useJjikboul());

        const shareUrl = result.current.getShareUrl();

        expect(shareUrl).toBe(window.location.href);
      });
    });

    describe("페이지 URL이 동적으로 변경될 때", () => {
      test("다른 찍볼 페이지로 네비게이션했을 때, 공유 URL을 요청하면, 변경된 URL을 반환한다", () => {
        const originalPushState = window.history.pushState;
        window.history.pushState({}, "", "/jjikboul/456");
        const { result } = renderHook(() => useJjikboul());

        const shareUrl = result.current.getShareUrl();

        expect(shareUrl).toBe(window.location.href);

        window.history.pushState = originalPushState;
      });
    });
  });

  describe("찍볼 데이터 유효성 검증", () => {
    const validJjikboulData: JjikboulDetail = {
      jjikboul: {
        jjikboulId: 123,
        problemType: "boulder",
        description: "test description",
        problemUrl: "https://example.com/image.jpg",
      },
      memberInfo: {
        memberId: 456,
        nickname: "testUser",
        profileUrl: "https://example.com/profile.jpg",
      },
      gym: {
        gymId: 123,
        gymName: "Test Gym",
      },
      level: {
        levelId: 456,
        colorNameKo: "빨간색",
        colorNameEn: "red",
        colorCode: "#FF0000",
      },
      isEditable: true,
      isDeletable: true,
    };

    describe("완전한 찍볼 데이터를 검증할 때", () => {
      test("모든 필수 필드가 포함된 찍볼 데이터가 있을 때, 데이터 유효성을 검증하면, 유효한 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());

        const isValid = result.current.validateJjikboulData(validJjikboulData);

        expect(isValid).toBe(true);
      });
    });

    describe("찍볼 기본 정보가 누락되었을 때", () => {
      test("찍볼 ID가 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutJjikboulId = {
          ...validJjikboulData,
          jjikboul: {
            ...validJjikboulData.jjikboul,
            jjikboulId: undefined as any,
          },
        };

        const isValid = result.current.validateJjikboulData(
          dataWithoutJjikboulId
        );

        expect(isValid).toBe(false);
      });

      test("찍볼 객체 전체가 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutJjikboul = {
          ...validJjikboulData,
          jjikboul: undefined as any,
        };

        const isValid =
          result.current.validateJjikboulData(dataWithoutJjikboul);

        expect(isValid).toBe(false);
      });
    });

    describe("사용자 정보가 누락되었을 때", () => {
      test("사용자 닉네임이 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutNickname = {
          ...validJjikboulData,
          memberInfo: {
            ...validJjikboulData.memberInfo,
            nickname: undefined as any,
          },
        };

        const isValid =
          result.current.validateJjikboulData(dataWithoutNickname);

        expect(isValid).toBe(false);
      });

      test("사용자 정보 객체 전체가 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutMemberInfo = {
          ...validJjikboulData,
          memberInfo: undefined as any,
        };

        const isValid = result.current.validateJjikboulData(
          dataWithoutMemberInfo
        );

        expect(isValid).toBe(false);
      });
    });

    describe("암장 정보가 누락되었을 때", () => {
      test("암장 이름이 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutGymName = {
          ...validJjikboulData,
          gym: {
            ...validJjikboulData.gym,
            gymName: undefined as any,
          },
        };

        const isValid = result.current.validateJjikboulData(dataWithoutGymName);

        expect(isValid).toBe(false);
      });

      test("암장 정보 객체 전체가 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutGym = {
          ...validJjikboulData,
          gym: undefined as any,
        };

        const isValid = result.current.validateJjikboulData(dataWithoutGym);

        expect(isValid).toBe(false);
      });
    });

    describe("난이도 정보가 누락되었을 때", () => {
      test("난이도 색상명이 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutColorName = {
          ...validJjikboulData,
          level: {
            ...validJjikboulData.level,
            colorNameKo: undefined as any,
          },
        };

        const isValid =
          result.current.validateJjikboulData(dataWithoutColorName);

        expect(isValid).toBe(false);
      });

      test("난이도 정보 객체 전체가 없는 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());
        const dataWithoutLevel = {
          ...validJjikboulData,
          level: undefined as any,
        };

        const isValid = result.current.validateJjikboulData(dataWithoutLevel);

        expect(isValid).toBe(false);
      });
    });

    describe("필수 필드가 빈 문자열일 때", () => {
      test("필수 텍스트 필드들이 빈 문자열인 데이터일 때, 유효성을 검증하면, 유효하지 않은 것으로 판단한다", () => {
        const { result } = renderHook(() => useJjikboul());

        const testCases = [
          {
            name: "닉네임이 빈 문자열",
            data: {
              ...validJjikboulData,
              memberInfo: { ...validJjikboulData.memberInfo, nickname: "" },
            },
          },
          {
            name: "암장명이 빈 문자열",
            data: {
              ...validJjikboulData,
              gym: { ...validJjikboulData.gym, gymName: "" },
            },
          },
          {
            name: "난이도 색상명이 빈 문자열",
            data: {
              ...validJjikboulData,
              level: { ...validJjikboulData.level, colorNameKo: "" },
            },
          },
        ];

        testCases.forEach(({ data }) => {
          const isValid = result.current.validateJjikboulData(data);

          expect(isValid).toBe(false);
        });
      });
    });
  });
});
