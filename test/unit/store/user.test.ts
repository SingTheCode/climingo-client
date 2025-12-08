import useUserStore from "@/domains/auth/store/user";
import { MemberInfo } from "@/shared/types/auth";

const mockMemberInfo: MemberInfo = {
  nickname: "testUser",
  profileUrl: "https://example.com/profile.jpg",
  memberId: 123,
  authId: "auth123",
  email: "test@example.com",
  providerType: "kakao",
};

describe("사용자 스토어 (useUserStore)", () => {
  beforeEach(() => {
    useUserStore.getState().clearUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태", () => {
    test("스토어 초기 상태는 null이다", () => {
      const { user } = useUserStore.getState();

      expect(user).toBeNull();
    });
  });

  describe("사용자 정보 설정", () => {
    test("사용자 정보를 설정하면 스토어에 저장된다", () => {
      expect(useUserStore.getState().user).toBeNull();

      useUserStore.getState().setUser(mockMemberInfo);

      expect(useUserStore.getState().user).toEqual(mockMemberInfo);
      expect(useUserStore.getState().user?.nickname).toBe("testUser");
      expect(useUserStore.getState().user?.memberId).toBe(123);
    });

    test("여러 번 사용자 정보를 설정하면 최신 정보로 업데이트된다", () => {
      expect(useUserStore.getState().user).toBeNull();

      useUserStore.getState().setUser(mockMemberInfo);
      expect(useUserStore.getState().user).toEqual(mockMemberInfo);

      const updatedInfo = { ...mockMemberInfo, nickname: "updatedUser" };
      useUserStore.getState().setUser(updatedInfo);

      expect(useUserStore.getState().user).toEqual(updatedInfo);
      expect(useUserStore.getState().user?.nickname).toBe("updatedUser");
    });

    test("동시에 여러 곳에서 접근해도 일관된 상태를 제공한다", () => {
      useUserStore.getState().setUser(mockMemberInfo);

      const reference1 = useUserStore.getState().user;
      const reference2 = useUserStore.getState().user;

      expect(reference1).toEqual(mockMemberInfo);
      expect(reference2).toEqual(mockMemberInfo);
      expect(reference1).toBe(reference2);
    });
  });

  describe("사용자 정보 삭제", () => {
    test("사용자 정보를 삭제하면 스토어에서 제거된다", () => {
      useUserStore.getState().setUser(mockMemberInfo);
      expect(useUserStore.getState().user).toEqual(mockMemberInfo);

      useUserStore.getState().clearUser();

      expect(useUserStore.getState().user).toBeNull();
    });

    test("사용자 정보 삭제 후 새로운 정보를 설정할 수 있다", () => {
      useUserStore.getState().setUser(mockMemberInfo);
      useUserStore.getState().clearUser();
      expect(useUserStore.getState().user).toBeNull();

      const newMemberInfo = { ...mockMemberInfo, nickname: "newUser" };
      useUserStore.getState().setUser(newMemberInfo);

      expect(useUserStore.getState().user).toEqual(newMemberInfo);
      expect(useUserStore.getState().user?.nickname).toBe("newUser");
    });
  });
});
