# 테스팅 가이드

이 문서는 Climingo 프로젝트의 테스트 작성 및 실행 가이드입니다.

## 테스트 구조

### 폴더 구조
```
test/
├── unit/          # 단위 테스트
│   ├── api/       # API 관련 테스트
│   ├── hooks/     # 커스텀 훅 테스트
│   ├── store/     # 상태 관리 테스트
│   └── utils/     # 유틸리티 함수 테스트
├── integration/   # 통합 테스트
│   ├── app/       # 앱 레벨 테스트
│   └── components/# 컴포넌트 통합 테스트
├── e2e/          # E2E 테스트 (Playwright)
│   ├── tests/
│   ├── fixtures/
│   └── utils/
└── mocks/        # 목 데이터 및 함수
```

## 단위 테스트 (Jest + React Testing Library)

### 컴포넌트 테스트
```typescript
// UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from '../UserProfile';

// 테스트용 QueryClient 생성
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// 래퍼 컴포넌트
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UserProfile 컴포넌트', () => {
  const mockUser = {
    id: '1',
    nickname: '테스트사용자',
    profileUrl: 'https://example.com/profile.jpg'
  };

  test('사용자 프로필이 올바르게 렌더링된다', () => {
    render(
      <UserProfile user={mockUser} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('테스트사용자')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.profileUrl);
  });

  test('편집 버튼 클릭 시 편집 모드로 변경된다', () => {
    const onEdit = jest.fn();
    
    render(
      <UserProfile user={mockUser} onEdit={onEdit} />,
      { wrapper: TestWrapper }
    );

    const editButton = screen.getByRole('button', { name: '편집' });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockUser.id);
  });

  test('로딩 상태일 때 스피너가 표시된다', () => {
    render(
      <UserProfile user={null} isLoading={true} />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 커스텀 훅 테스트
```typescript
// useJjikbol.test.ts
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useJjikbol from '../useJjikbol';

// 목 데이터
const mockJjikbolData = {
  jjikbol: {
    id: '1',
    problemType: 'boulder',
    description: '테스트 문제',
    createdDate: '2024-01-01'
  },
  memberInfo: {
    nickname: '테스트사용자',
    profileUrl: ''
  },
  gym: {
    gymId: '1',
    gymName: '테스트암장'
  },
  level: {
    levelId: '1',
    colorNameKo: '초급',
    colorNameEn: 'beginner'
  }
};

describe('useJjikbol 훅', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  test('공유 기능이 올바르게 동작한다', async () => {
    // navigator.share 목킹
    Object.defineProperty(navigator, 'share', {
      value: jest.fn().mockResolvedValue(undefined),
      writable: true
    });

    const { result } = renderHook(() => useJjikbol(), { wrapper });

    await act(async () => {
      await result.current.shareToNative(mockJjikbolData);
    });

    expect(navigator.share).toHaveBeenCalledWith({
      title: expect.stringContaining('테스트암장'),
      text: expect.stringContaining('테스트사용자'),
      url: expect.any(String)
    });
  });

  test('공유 API를 지원하지 않으면 클립보드 복사가 실행된다', async () => {
    // navigator.share를 undefined로 설정
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true
    });

    // navigator.clipboard 목킹
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined)
      },
      writable: true
    });

    const { result } = renderHook(() => useJjikbol(), { wrapper });

    await act(async () => {
      await result.current.shareToNative(mockJjikbolData);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
```

### API 함수 테스트
```typescript
// jjikbol.api.test.ts
import { getJjikbolDetailApi } from '../api/modules/jjikbol';
import { api } from '../api/axios';

// axios 목킹
jest.mock('../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

describe('찍볼 API 함수들', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getJjikbolDetailApi가 성공적으로 데이터를 반환한다', async () => {
    const mockResponse = {
      status: 200,
      data: {
        jjikbol: {
          jjikbolId: '1',
          problemType: 'boulder',
          description: '테스트 문제',
          createdDate: '2024-01-01'
        },
        memberInfo: {
          nickname: '테스트사용자'
        }
      }
    };

    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await getJjikbolDetailApi('1');

    expect(mockedApi.get).toHaveBeenCalledWith('/jjikbol/1');
    expect(result).toEqual(mockResponse.data);
  });

  test('API 에러 시 에러가 발생한다', async () => {
    mockedApi.get.mockResolvedValue({ status: 404 });

    await expect(getJjikbolDetailApi('invalid-id')).rejects.toThrow();
  });
});
```

## 통합 테스트

### 페이지 통합 테스트
```typescript
// JjikbolShareDetail.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JjikbolShareDetail from '../JjikbolShareDetail';
import { getJjikbolDetailApi } from '../../api/modules/jjikbol';

// API 목킹
jest.mock('../../api/modules/jjikbol');
const mockedGetJjikbolDetailApi = getJjikbolDetailApi as jest.MockedFunction<typeof getJjikbolDetailApi>;

// Next.js 라우터 목킹
jest.mock('next/navigation', () => ({
  useParams: () => ({ jjikbolId: '1' }),
}));

describe('JjikbolShareDetail 페이지', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
        mutations: { retry: false },
      },
    });

    mockedGetJjikbolDetailApi.mockResolvedValue({
      jjikbol: {
        jjikbolId: '1',
        problemType: 'boulder',
        description: '훌륭한 볼더링 문제입니다.',
        createdDate: '2024-01-01'
      },
      memberInfo: {
        nickname: '클라이머123',
        profileUrl: 'https://example.com/profile.jpg'
      },
      gym: {
        gymId: 1,
        gymName: '클라이밍 짐'
      },
      level: {
        levelId: 1,
        colorNameKo: '초급',
        colorNameEn: 'beginner'
      },
      isEditable: false,
      isDeletable: false
    });
  });

  test('찍볼 상세 정보가 올바르게 표시된다', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <JjikbolShareDetail />
      </QueryClientProvider>
    );

    // 로딩 상태 확인
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // 데이터 로딩 완료 후 확인
    await waitFor(() => {
      expect(screen.getByText('클라이머123')).toBeInTheDocument();
    });

    expect(screen.getByText('클라이밍 짐')).toBeInTheDocument();
    expect(screen.getByText('훌륭한 볼더링 문제입니다.')).toBeInTheDocument();
  });

  test('에러 상태에서 에러 메시지가 표시된다', async () => {
    mockedGetJjikbolDetailApi.mockRejectedValue(new Error('API 에러'));

    render(
      <QueryClientProvider client={queryClient}>
        <JjikbolShareDetail />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('문제를 불러올 수 없습니다.')).toBeInTheDocument();
    });
  });
});
```

## E2E 테스트 (Playwright)

### 기본 E2E 테스트
```typescript
// jjikbol-share.spec.ts
import { test, expect } from '@playwright/test';

test.describe('찍볼 공유 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 데이터 설정
    await page.route('**/api/jjikbol/1', async route => {
      await route.fulfill({
        json: {
          jjikbol: {
            jjikbolId: '1',
            problemType: 'boulder',
            description: 'E2E 테스트 문제',
            createdDate: '2024-01-01'
          },
          memberInfo: {
            nickname: 'E2E테스터'
          }
        }
      });
    });
  });

  test('찍볼 상세 페이지가 올바르게 로드된다', async ({ page }) => {
    await page.goto('/jjikbol/1');
    
    // 로딩이 완료될 때까지 대기
    await expect(page.getByTestId('loading-spinner')).toBeHidden();
    
    // 컨텐츠 확인
    await expect(page.getByText('E2E테스터')).toBeVisible();
    await expect(page.getByText('E2E 테스트 문제')).toBeVisible();
  });

  test('공유 버튼이 작동한다', async ({ page, context }) => {
    // 권한 부여
    await context.grantPermissions(['web-share']);
    
    await page.goto('/jjikbol/1');
    
    // 공유 버튼 클릭
    const shareButton = page.getByRole('button', { name: '공유하기' });
    await shareButton.click();
    
    // 공유 다이얼로그나 결과 확인 (구체적인 구현에 따라)
  });

  test('모바일에서 반응형 디자인이 올바르게 적용된다', async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/jjikbol/1');
    
    // 모바일 레이아웃 확인
    const container = page.getByTestId('jjikbol-share-container');
    await expect(container).toHaveCSS('max-width', '390px');
  });
});
```

## 테스트 실행

### 명령어
```bash
# 전체 테스트 실행
npm test

# 단위 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration

# E2E 테스트 실행
npm run test:e2e

# 테스트 커버리지 확인
npm run test:coverage

# 특정 파일 테스트
npm test -- UserProfile.test.tsx

# 감시 모드로 실행
npm test -- --watch
```

### 테스트 실행 환경
```typescript
// test/setup.ts
import '@testing-library/jest-dom';

// 전역 목 설정
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ResizeObserver 목킹
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

## 모킹 가이드

### API 모킹
```typescript
// test/mocks/api.ts
export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// 성공 응답 모킹
export const mockSuccessResponse = <T>(data: T) => ({
  status: 200,
  data
});

// 에러 응답 모킹
export const mockErrorResponse = (status: number, message: string) => ({
  status,
  message
});
```

### 브라우저 API 모킹
```typescript
// test/mocks/browser.ts
export const mockNavigator = {
  share: jest.fn(),
  clipboard: {
    writeText: jest.fn()
  }
};

export const mockLocation = {
  href: 'http://localhost:3000/test',
  assign: jest.fn(),
  reload: jest.fn()
};
```

## 테스트 작성 원칙

### 좋은 테스트의 특징
1. **명확한 테스트명**: 무엇을 테스트하는지 명확히 표현
2. **독립성**: 다른 테스트에 의존하지 않음
3. **반복 가능**: 언제 실행해도 같은 결과
4. **빠른 실행**: 단위 테스트는 빠르게 실행
5. **의미 있는 단언**: 중요한 동작과 결과만 검증

### AAA 패턴
```typescript
test('사용자가 로그인할 수 있다', async () => {
  // Arrange (준비)
  const userData = { email: 'test@example.com', password: 'password' };
  const mockLoginApi = jest.fn().mockResolvedValue({ success: true });
  
  // Act (실행)
  const result = await login(userData);
  
  // Assert (검증)
  expect(mockLoginApi).toHaveBeenCalledWith(userData);
  expect(result.success).toBe(true);
});
```

### 테스트 커버리지 목표
- **라인 커버리지**: 80% 이상
- **함수 커버리지**: 90% 이상
- **브랜치 커버리지**: 75% 이상
- **핵심 비즈니스 로직**: 100% 커버리지