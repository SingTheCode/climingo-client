import { jest } from "@jest/globals";

export const mockJjikboulData = {
  jjikboul: {
    jjikboulId: 123,
    problemType: "boulder",
    description:
      "start 지점 부터 top 까지 올라가시면 됩니다. 동그라미는 손과 발 모두 사용할 수 있는 홀드입니다.",
    problemUrl: "https://example.com/test-problem-image.jpg",
  },
  memberInfo: {
    memberId: 12345,
    nickname: "나는야김고란",
    profileUrl: "/images/test-profile.jpg",
  },
  gym: {
    gymId: "test-gym-id",
    gymName: "더클라임 강남점",
  },
  level: {
    levelId: "test-level-id",
    colorNameKo: "주황색",
    colorNameEn: "orange",
  },
  isEditable: false,
  isDeletable: false,
};

export const mockUseJjikboulReturn = {
  getShareUrl: jest.fn(() => "https://example.com/share-url"),
  validateJjikboulData: jest.fn(() => true),
};
