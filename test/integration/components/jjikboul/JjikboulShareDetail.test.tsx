import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jest } from "@jest/globals";

import JjikboulShareDetail from "@/components/jjikboul/JjikboulShareDetail";
import { useGetJjikboulDetailQuery } from "@/api/hooks/jjikboul";
import useJjikboul from "@/hooks/jjikboul/useJjikboul";
import useJjikboulUI from "@/hooks/jjikboul/useJjikboulUI";
import useImageDownload from "@/hooks/useImageDownload";
import useAppScheme from "@/hooks/useAppScheme";
import {
  mockJjikboulData,
  mockUseJjikboulReturn,
} from "@/test/mocks/jjikboulData";

jest.mock("@/api/hooks/jjikboul");
jest.mock("@/hooks/jjikboul/useJjikboul");
jest.mock("@/hooks/jjikboul/useJjikboulUI");
jest.mock("@/hooks/useImageDownload");
jest.mock("@/hooks/useAppScheme");
jest.mock("next/navigation", () => ({
  useParams: () => ({ jjikboulId: "test-jjikboul-id" }),
  useRouter: () => ({
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("JjikboulShareDetail", () => {
  let queryClient: QueryClient;

  const mockCopyToClipboard = jest.fn();
  const mockDownloadImage = jest.fn();
  const mockShare = jest.fn();
  const mockIsNativeShareAvailable = jest.fn(() => false);
  const mockIsNativeDownloadAvailable = jest.fn(() => false);

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    jest.clearAllMocks();

    (useGetJjikboulDetailQuery as jest.Mock).mockReturnValue({
      data: mockJjikboulData,
      isLoading: false,
      isError: false,
    });

    (useJjikboul as jest.Mock).mockReturnValue({
      ...mockUseJjikboulReturn,
    });

    (useJjikboulUI as jest.Mock).mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
    });

    (useImageDownload as jest.Mock).mockReturnValue({
      downloadImage: mockDownloadImage,
      isNativeDownloadAvailable: mockIsNativeDownloadAvailable,
      isDownloading: false,
      downloadResult: null,
    });

    (useAppScheme as jest.Mock).mockReturnValue({
      share: mockShare,
      isNativeShareAvailable: mockIsNativeShareAvailable,
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <JjikboulShareDetail />
      </QueryClientProvider>
    );
  };



  describe("제작자 정보", () => {
    test("문제를 만든 사용자의 프로필 사진을 표시해야 한다", () => {
      renderComponent();
      const profileImage = screen.getByRole("img", { name: /나는야김고란/i });
      expect(profileImage).toBeInTheDocument();
    });

    test("문제를 만든 사용자의 닉네임을 표시해야 한다", () => {
      renderComponent();
      expect(screen.getByText("나는야김고란")).toBeInTheDocument();
    });
  });

  describe("문제 이미지", () => {
    test("찍볼 문제를 고품질 이미지로 표시해야 한다", () => {
      renderComponent();
      const problemImage = screen.getByTestId("jjikboul-problem-image");
      expect(problemImage).toBeInTheDocument();
    });
  });


  describe("설명 텍스트", () => {
    test("문제 설명이 표시되어야 한다", () => {
      renderComponent();
      expect(screen.getByText(/start 지점 부터 top 까지/)).toBeInTheDocument();
    });
  });

  describe("공유 버튼", () => {
    test("공유 버튼이 표시되어야 한다", () => {
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });
      expect(shareButton).toBeInTheDocument();
    });

    test("네이티브 공유 가능 시 네이티브 공유 기능이 호출되어야 한다", async () => {
      mockIsNativeShareAvailable.mockReturnValue(true);
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });

      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          url: expect.any(String),
          title: "찍볼 공유",
          text: "찍볼을 확인해보세요!",
        });
      });
    });

    test("네이티브 공유 불가능 시 클립보드 복사가 호출되어야 한다", async () => {
      mockCopyToClipboard.mockImplementation(() => Promise.resolve());
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });

      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.any(String));
      });
    });

    test("공유 아이콘이 포함되어야 한다", () => {
      renderComponent();
      expect(screen.getByTestId("share-icon")).toBeInTheDocument();
    });
  });

  describe("이미지 저장", () => {
    test("저장하기 버튼이 표시되어야 한다", () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /저장하기/i });
      expect(saveButton).toBeInTheDocument();
    });

    test("저장하기 버튼 클릭 시 이미지 다운로드 기능이 호출되어야 한다", async () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /저장하기/i });

      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockDownloadImage).toHaveBeenCalledWith(mockJjikboulData.jjikboul.problemUrl);
      });
    });

    test("다운로드 아이콘이 포함되어야 한다", () => {
      renderComponent();
      expect(screen.getByTestId("download-icon")).toBeInTheDocument();
    });
  });

  describe("반응형 디자인", () => {
    test("모바일 화면 크기에 최적화된 레이아웃이어야 한다", () => {
      renderComponent();
      const container = screen.getByTestId("jjikboul-share-container");
      expect(container).toHaveClass("w-full");
      expect(container).toHaveClass("max-w-[40rem]");
    });

    test("액션 버튼들이 적절한 크기로 표시되어야 한다", () => {
      renderComponent();
      const shareButton = screen.getByRole("button", { name: /공유하기/i });
      const saveButton = screen.getByRole("button", { name: /저장하기/i });

      expect(shareButton).toHaveClass("w-[18rem]", "h-[5rem]");
      expect(saveButton).toHaveClass("w-[18rem]", "h-[5rem]");
    });
  });

  describe("로딩 상태", () => {
    test("데이터 로딩 중일 때 로딩 스피너를 표시해야 한다", () => {
      (useGetJjikboulDetailQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      });

      renderComponent();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("에러 상태", () => {
    test("데이터 로딩 실패 시 에러 메시지를 표시해야 한다", () => {
      (useGetJjikboulDetailQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
      });

      renderComponent();
      expect(screen.getByText(/문제를 불러올 수 없습니다/)).toBeInTheDocument();
    });
  });
});
