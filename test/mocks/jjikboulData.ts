import { jest } from "@jest/globals";

export const mockJjikboulData = {
  jjikboul: {
    id: "test-jjikboul-id",
    problemType: "boulder",
    description:
      "start 지점 부터 top 까지 올라가시면 됩니다. 동그라미는 손과 발 모두 사용할 수 있는 홀드입니다.",
    createdDate: "2024-01-15T10:30:00Z",
  },
  memberInfo: {
    id: "12345",
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
  shareToNative: jest.fn(),
  shareCurrentJjikboul: jest.fn(),
  saveAsImage: jest.fn(),
  isShareAvailable: true,
};
