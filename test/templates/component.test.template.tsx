// Component 테스트 템플릿
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/helpers/renderWithProviders';

// 예시: ExampleComponent 테스트
describe('ExampleComponent', () => {
  it('컴포넌트가 올바르게 렌더링된다', () => {
    // Given: 컴포넌트 렌더링
    renderWithProviders(<ExampleComponent />);

    // Then: 요소 존재 확인
    expect(screen.getByText('예시 텍스트')).toBeInTheDocument();
  });

  it('버튼 클릭 시 올바른 동작을 수행한다', () => {
    // Given: 컴포넌트 렌더링
    const mockOnClick = jest.fn();
    renderWithProviders(<ExampleComponent onClick={mockOnClick} />);

    // When: 버튼 클릭
    fireEvent.click(screen.getByRole('button'));

    // Then: 함수 호출 확인
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
