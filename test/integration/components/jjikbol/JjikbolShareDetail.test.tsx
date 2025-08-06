import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jest } from "@jest/globals";

import JjikbolShareDetail from "@/components/jjikbol/JjikbolShareDetail";
import { useGetJjikbolDetailQuery } from "@/api/hooks/jjikbol";
import useJjikbol from "@/hooks/jjikbol/useJjikbol";
import {
  mockJjikbolData,
  mockUseJjikbolReturn,
} from "@/test/mocks/jjikbolData";

// Mock dependencies
jest.mock("@/api/hooks/jjikbol");
jest.mock("@/hooks/jjikbol/useJjikbol");
jest.mock("next/navigation", () => ({
  useParams: () => ({ jjikbolId: "test-jjikbol-id" }),
  useRouter: () => ({
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("JjikbolShareDetail", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    jest.clearAllMocks();

    (useGetJjikbolDetailQuery as jest.Mock).mockReturnValue({
      data: mockJjikbolData,
      isLoading: false,
      isError: false,
    });

    (useJjikbol as jest.Mock).mockReturnValue(mockUseJjikbolReturn);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <JjikbolShareDetail />
      </QueryClientProvider>
    );
  };

  describe("암장 정보 표시", () => {
    it("암장명을 명확히 표시해야 한다", () => {
      renderComponent();
      expect(screen.getByText("더클라임 강남점")).toBeInTheDocument();
    });

    it("암장 정보에 위치 아이콘이 포함되어야 한다", () => {
      renderComponent();
      expect(
        screen.getByRole("img", { name: /location/i })
      ).toBeInTheDocument();
    });
  });

  describe("난이도 표시", () => {
    it("난이도를 시각적으로 구분하여 표시해야 한다", () => {
      renderComponent();
      const levelIcon = screen.getByTestId("level-icon-orange");
      expect(levelIcon).toBeInTheDocument();
    });

    it("난이도 컬러 표시가 있어야 한다", () => {
      renderComponent();
      const levelIcon = screen.getByTestId("level-icon-orange");
      expect(levelIcon).toBeInTheDocument();
      expect(levelIcon).toHaveStyle({ backgroundColor: "rgb(255, 179, 35)" });
    });
  });

  describe("제작자 정보", () => {
    it("문제를 만든 사용자의 프로필 사진을 표시해야 한다", () => {
      renderComponent();
      const profileImage = screen.getByRole("img", { name: /나는야김고란/i });
      expect(profileImage).toBeInTheDocument();
    });

    it("문제를 만든 사용자의 닉네임을 표시해야 한다", () => {
      renderComponent();
      expect(screen.getByText("나는야김고란")).toBeInTheDocument();
    });
  });

  describe("문제 이미지", () => {
    it("찍볼 문제를 고품질 이미지로 표시해야 한다", () => {
      renderComponent();
      const problemImage = screen.getByTestId("jjikbol-problem-image");
      expect(problemImage).toBeInTheDocument();
    });
  });

  describe("브랜드 로고", () => {
    it("클라밍고 앱 로고를 적절한 위치에 배치해야 한다", () => {
      renderComponent();
      const logo = screen.getByRole("img", { name: /클라밍고/i });
      expect(logo).toBeInTheDocument();
    });

    it("텍스트 로고도 함께 표시되어야 한다", () => {
      renderComponent();
      expect(screen.getByTestId("text-logo")).toBeInTheDocument();
    });
  });

  describe("설명 텍스트", () => {
    it("문제 설명이 표시되어야 한다", () => {
      renderComponent();
      expect(screen.getByText(/start 지점 부터 top 까지/)).toBeInTheDocument();
    });
  });

  describe("공유 버튼", () => {
    it("공유 버튼이 표시되어야 한다", () => {
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });
      expect(shareButton).toBeInTheDocument();
    });

    it("공유 버튼 클릭 시 네이티브 공유 기능이 호출되어야 한다", async () => {
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });

      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockUseJjikbolReturn.shareToNative).toHaveBeenCalledWith({
          jjikbol: mockJjikbolData.jjikbol,
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
        });
      });
    });

    it("공유 아이콘이 포함되어야 한다", () => {
      renderComponent();
      expect(screen.getByTestId("share-icon")).toBeInTheDocument();
    });
  });

  describe("이미지 저장", () => {
    it("저장하기 버튼이 표시되어야 한다", () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /저장하기/i });
      expect(saveButton).toBeInTheDocument();
    });

    it("저장하기 버튼 클릭 시 이미지 저장 기능이 호출되어야 한다", async () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /저장하기/i });

      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUseJjikbolReturn.saveAsImage).toHaveBeenCalled();
      });
    });

    it("다운로드 아이콘이 포함되어야 한다", () => {
      renderComponent();
      expect(screen.getByTestId("download-icon")).toBeInTheDocument();
    });
  });

  describe("반응형 디자인", () => {
    it("모바일 화면 크기에 최적화된 레이아웃이어야 한다", () => {
      renderComponent();
      const container = screen.getByTestId("jjikbol-share-container");
      expect(container).toHaveClass("w-full");
      expect(container).toHaveStyle({ maxWidth: "390px" });
    });

    it("액션 버튼들이 적절한 크기로 표시되어야 한다", () => {
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });
      const saveButton = screen.getByRole("button", { name: /저장하기/i });

      expect(shareButton).toHaveClass("w-[170px]", "h-12");
      expect(saveButton).toHaveClass("w-[170px]", "h-12");
    });
  });

  describe("로딩 상태", () => {
    it("데이터 로딩 중일 때 로딩 스피너를 표시해야 한다", () => {
      (useGetJjikbolDetailQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      });

      renderComponent();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("에러 상태", () => {
    it("데이터 로딩 실패 시 에러 메시지를 표시해야 한다", () => {
      (useGetJjikbolDetailQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
      });

      renderComponent();
      expect(screen.getByText(/문제를 불러올 수 없습니다/)).toBeInTheDocument();
    });
  });
});
