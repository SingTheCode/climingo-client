// Hook 테스트 템플릿
import { renderHook, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/helpers/renderWithProviders';

// 예시: useExample Hook 테스트
describe('useExample', () => {
  it('초기 상태가 올바르게 설정된다', () => {
    // Given: Hook 렌더링
    const { result } = renderHook(() => useExample(), {
      wrapper: ({ children }) => renderWithProviders(<>{children}</>).container,
    });

    // Then: 초기 상태 확인
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('데이터를 성공적으로 가져온다', async () => {
    // Given: Hook 렌더링
    const { result } = renderHook(() => useExample(), {
      wrapper: ({ children }) => renderWithProviders(<>{children}</>).container,
    });

    // When: 데이터 요청
    result.current.fetchData();

    // Then: 데이터 로딩 및 성공 확인
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
