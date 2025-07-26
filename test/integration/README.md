# Integration Tests

이 디렉토리는 컴포넌트 간 상호작용과 페이지 레벨의 통합 테스트를 포함합니다.

## 디렉토리 구조

- `app/` - 페이지 컴포넌트 통합 테스트
- `components/` - 복합 컴포넌트 통합 테스트

## 테스트 실행

```bash
# 모든 integration 테스트 실행
npm run test:integration

# 특정 파일만 실행
npm run test:integration -- components/RecordList.test.tsx

# 감시 모드로 실행
npm run test:integration -- --watch

# 커버리지와 함께 실행
npm run test:integration -- --coverage
```

## 테스트 작성 가이드

### 기본 구조

```typescript
import { render, screen, fireEvent } from '@/test/utils';
import RecordList from '@/components/record/RecordList';

describe('RecordList 컴포넌트', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('기록 목록을 렌더링하고 클릭 시 상세 페이지로 이동해야 한다', () => {
    const mockRecords = [
      { id: '1', title: '테스트 기록', content: '테스트 내용' }
    ];

    render(<RecordList records={mockRecords} />);

    expect(screen.getByText('테스트 기록')).toBeInTheDocument();

    fireEvent.click(screen.getByText('테스트 기록'));
    // 네비게이션 검증 로직
  });
});
```

### AAA 패턴 준수

모든 테스트는 Arrange-Act-Assert 패턴을 따릅니다:

```typescript
test('사용자가 버튼을 클릭하면 특정 동작이 수행되어야 한다', async () => {
  // Arrange (준비)
  const user = userEvent.setup();
  const mockOnClick = jest.fn();
  render(<Button onClick={mockOnClick}>클릭</Button>);

  // Act (실행)
  const button = screen.getByRole('button', { name: '클릭' });
  await user.click(button);

  // Assert (검증)
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
```

### BDD 스타일 테스트 설명

```typescript
// ❌ 잘못된 예
test("RecordList component", () => {});
test("should render records", () => {});

// ✅ 좋은 예
test("기록 목록을 올바르게 렌더링해야 한다", () => {});
test("기록이 없을 때 빈 상태를 표시해야 한다", () => {});
```

### 컴포넌트 렌더링 및 Provider 설정

```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/store/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {component}
      </UserProvider>
    </QueryClientProvider>
  );
};

test('Provider가 포함된 컴포넌트 테스트', () => {
  renderWithProviders(<MyComponent />);
  // 테스트 로직
});
```

### 사용자 상호작용 시뮬레이션

```typescript
import userEvent from '@testing-library/user-event';

test('사용자가 폼을 입력하고 제출할 수 있어야 한다', async () => {
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();

  render(<LoginForm onSubmit={mockOnSubmit} />);

  const emailInput = screen.getByRole('textbox', { name: /이메일/i });
  const passwordInput = screen.getByLabelText(/비밀번호/i);
  const submitButton = screen.getByRole('button', { name: /로그인/i });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(mockOnSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### React Query 통합 테스트

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('React Query와 컴포넌트가 올바르게 통합되어야 한다', async () => {
  const { result } = renderHook(() => useGetUserQuery('123'), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual({ id: '123', name: '테스트 사용자' });
});
```

### Next.js Router 통합 테스트

```typescript
import { useRouter } from 'next/router';

// Next.js router 모킹
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  pathname: '/',
  query: {},
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

test('라우터 네비게이션이 올바르게 작동해야 한다', async () => {
  const user = userEvent.setup();
  render(<NavigationComponent />);

  const link = screen.getByRole('link', { name: '대시보드' });
  await user.click(link);

  expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
});
```

## 검증(Assertions) 가이드

### 기본 검증

```typescript
// 존재 여부 검증
expect(screen.getByText("텍스트")).toBeInTheDocument();
expect(screen.queryByText("에러메시지")).not.toBeInTheDocument();

// 표시 상태 검증
expect(screen.getByRole("alert")).toBeVisible();

// 활성화 상태 검증
expect(screen.getByRole("button")).toBeEnabled();
expect(screen.getByRole("button")).toBeDisabled();

// 값/선택 상태 검증
expect(screen.getByRole("textbox")).toHaveValue("예상 값");
expect(screen.getByRole("checkbox")).toBeChecked();
```

### 비동기 검증

```typescript
// findBy* 사용 (권장)
const element = await screen.findByText("비동기 데이터");
expect(element).toBeInTheDocument();

// waitFor 사용
await waitFor(() => {
  expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
});
```

## 모킹 전략

### API 모킹

```typescript
jest.mock("@/api/modules/user");
jest.mock("@/hooks/auth");

const mockedUserApi = jest.mocked(require("@/api/modules/user"));
const mockedUseAuth = jest.mocked(require("@/hooks/auth").useAuth);

beforeEach(() => {
  mockedUseAuth.mockReturnValue({
    login: jest.fn().mockResolvedValue(true),
    user: { id: "123", email: "test@example.com" },
  } as any);

  mockedUserApi.login.mockResolvedValue({
    status: 200,
    data: { token: "mock-token" },
  });
});
```

### Mutation 모킹

```typescript
import { useMutation } from '@tanstack/react-query';

test('리워드 적립 버튼 클릭 시 mutation이 호출된다', async () => {
  const user = userEvent.setup();
  const mockMutation = jest.fn();

  jest.spyOn(require('@tanstack/react-query'), 'useMutation').mockReturnValue({
    mutate: mockMutation,
    isLoading: false,
  });

  render(<RewardComponent />);

  const rewardButton = screen.getByRole('button', { name: '리워드 받기' });
  await user.click(rewardButton);

  expect(mockMutation).toHaveBeenCalled();
  expect(mockMutation).toHaveBeenCalledWith({ promotionId: 'PROMO-123' });
});
```

## 테스트 데이터 관리

### Mock 데이터

```typescript
// test/mocks/module/records.ts
export const MOCK_RECORDS = [
  {
    id: "1",
    title: "첫 번째 기록",
    content: "첫 번째 기록 내용",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "두 번째 기록",
    content: "두 번째 기록 내용",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

export const MOCK_USER = {
  id: "123",
  email: "test@example.com",
  nickname: "테스트 사용자",
};
```

## 체크리스트

테스트 작성 시 다음 사항을 확인하세요:

- [ ] 테스트 이름이 한글이고 BDD 스타일인가?
- [ ] AAA 패턴이 명확히 구분되어 있는가?
- [ ] getByRole을 우선적으로 사용했는가?
- [ ] 비동기 처리가 올바르게 되어 있는가?
- [ ] 외부 의존성이 적절히 모킹되어 있는가?
- [ ] afterEach에서 jest.clearAllMocks() 호출하는가?
- [ ] 모든 테스트 설명이 한글로 작성되었는가?
- [ ] 사용자 관점에서 테스트를 작성했는가?
- [ ] 테스트가 독립적으로 실행 가능한가?

## 금지사항

### 절대 사용하지 말 것

- querySelector 또는 querySelectorAll
- 클래스명 기반 선택자 (.className)
- ID 기반 선택자 (#id)
- 복잡한 CSS 선택자
- container.firstChild 등 DOM 직접 접근

### 지양해야 할 패턴

- 테스트에서 implementation details 검증
- 내부 state나 props 직접 접근
- 컴포넌트 인스턴스 메서드 직접 호출
- 과도한 모킹 (실제 동작과 차이 발생)
