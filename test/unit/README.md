# Unit Tests

이 디렉토리는 개별 함수, 훅, 유틸리티 등의 단위 테스트를 포함합니다.

## 디렉토리 구조

- `hooks/` - 커스텀 훅 테스트
- `api/` - API 관련 함수 테스트
- `store/` - 상태 관리 스토어 테스트
- `utils/` - 유틸리티 함수 테스트

## 테스트 실행

```bash
# 모든 unit 테스트 실행
npm run test:unit

# 특정 파일만 실행
npm run test:unit -- utils/common.test.ts

# 감시 모드로 실행
npm run test:unit -- --watch

# 커버리지와 함께 실행
npm run test:unit -- --coverage
```

## 테스트 작성 가이드

### 기본 구조

```typescript
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/auth";

describe("useAuth 훅", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("사용자가 로그인되어 있지 않으면 null을 반환해야 한다", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});
```

### AAA 패턴 준수

모든 테스트는 Arrange-Act-Assert 패턴을 따릅니다:

```typescript
test("유틸리티 함수가 올바른 값을 반환해야 한다", () => {
  // Arrange (준비)
  const input = "test input";

  // Act (실행)
  const result = formatInput(input);

  // Assert (검증)
  expect(result).toBe("formatted test input");
});
```

### BDD 스타일 테스트 설명

```typescript
// ❌ 잘못된 예
test("formatDate function", () => {});
test("should return formatted date", () => {});

// ✅ 좋은 예
test("날짜를 상대적 시간으로 포맷해야 한다", () => {});
test("유효한 이메일을 true로 반환해야 한다", () => {});
```

### Zustand 스토어 테스트

```typescript
import { renderHook, act } from "@testing-library/react";
import { useUserStore } from "@/store/user";

describe("사용자 스토어 (useUserStore)", () => {
  beforeEach(() => {
    // 각 테스트마다 스토어 초기화
    const store = useUserStore.getState();
    store.reset();
  });

  test("액션 실행 시 상태가 올바르게 변경된다", async () => {
    const { result } = renderHook(() => useUserStore());

    act(() => {
      result.current.setUser({ id: "123", email: "test@example.com" });
    });

    expect(result.current.user).toEqual({
      id: "123",
      email: "test@example.com",
    });
  });
});
```

### React Query 훅 테스트

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

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

test('React Query 훅이 올바른 데이터를 반환해야 한다', async () => {
  const { result } = renderHook(() => useGetUserQuery('123'), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual({ id: '123', name: '테스트 사용자' });
});
```

### 모킹 전략

#### API 모킹

```typescript
jest.mock("@/api/modules/user");

const mockedUserApi = jest.mocked(require("@/api/modules/user"));

beforeEach(() => {
  mockedUserApi.login.mockResolvedValue({
    status: 200,
    data: { token: "mock-token" },
  });
});
```

#### 함수 모킹 (Spy)

```typescript
test("함수가 올바른 인자와 함께 호출되어야 한다", async () => {
  const mockFunction = jest.fn();
  jest
    .spyOn(require("@/utils/helpers"), "formatData")
    .mockImplementation(mockFunction);

  const result = processData({ id: "123", name: "test" });

  expect(mockFunction).toHaveBeenCalledWith({ id: "123", name: "test" });
});
```

## 검증(Assertions) 가이드

### 기본 검증

```typescript
// 존재 여부 검증
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// 값 검증
expect(element).toHaveValue("expected value");
expect(element).toHaveTextContent("expected text");

// 상태 검증
expect(element).toBeEnabled();
expect(element).toBeDisabled();
expect(element).toBeVisible();
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

## 테스트 데이터 관리

### Mock 데이터

```typescript
// test/mocks/module/users.ts
export const TEST_USERS = {
  valid: {
    email: "test@example.com",
    password: "password123",
  },
  invalid: {
    email: "invalid@example.com",
    password: "wrong",
  },
};

export const MOCK_RESPONSES = {
  success: { status: 200, message: "성공" },
  error: { status: 500, message: "서버 오류" },
};
```

## 체크리스트

테스트 작성 시 다음 사항을 확인하세요:

- [ ] 테스트 이름이 한글이고 BDD 스타일인가?
- [ ] AAA 패턴이 명확히 구분되어 있는가?
- [ ] afterEach에서 jest.clearAllMocks() 호출하는가?
- [ ] 비동기 처리가 올바르게 되어 있는가?
- [ ] 외부 의존성이 적절히 모킹되어 있는가?
- [ ] 모든 테스트 설명이 한글로 작성되었는가?
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
