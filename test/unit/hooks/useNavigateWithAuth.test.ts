import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useNavigateWithAuth } from "@/hooks/common";
import { loginCheck } from "@/utils/common";

// Mock dependencies
jest.mock("next/navigation");
jest.mock("@/utils/common");

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockLoginCheck = loginCheck as jest.MockedFunction<typeof loginCheck>;

describe("useNavigateWithAuth", () => {
  const mockPush = jest.fn();
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      mockLoginCheck.mockReturnValue(true);
    });

    it("should navigate to specified path and execute callback", () => {
      const { result } = renderHook(() => useNavigateWithAuth());
      
      act(() => {
        result.current("/test/path", mockCallback);
      });

      expect(mockLoginCheck).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/test/path");
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should navigate to path without callback", () => {
      const { result } = renderHook(() => useNavigateWithAuth());
      
      act(() => {
        result.current("/test/path");
      });

      expect(mockLoginCheck).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/test/path");
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      mockLoginCheck.mockReturnValue(false);
    });

    it("should not navigate and not execute callback", () => {
      const { result } = renderHook(() => useNavigateWithAuth());
      
      act(() => {
        result.current("/test/path", mockCallback);
      });

      expect(mockLoginCheck).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it("should not navigate and not execute callback when no callback provided", () => {
      const { result } = renderHook(() => useNavigateWithAuth());
      
      act(() => {
        result.current("/test/path");
      });

      expect(mockLoginCheck).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("callback stability", () => {
    it("should return the same function reference across re-renders", () => {
      const { result, rerender } = renderHook(() => useNavigateWithAuth());
      const firstReference = result.current;
      
      rerender();
      
      expect(result.current).toBe(firstReference);
    });
  });
});