---
inclusion: fileMatch
fileMatchPattern: "**/*.test.{ts,tsx,js,jsx}"
---

# 테스트 코드 작성 규칙

## TDD 사이클 (Red-Green-Refactor)

모든 코드 작성은 TDD 방식으로 진행합니다.

### 1. Red: 실패하는 테스트 작성
- 구현하려는 기능의 테스트를 먼저 작성
- 테스트 실행 시 실패 확인 (아직 구현 안 됨)

```typescript
describe('페이지 스택 관리 (usePageStackStore)', () => {
    test('새 페이지로 이동할 때 스택에 페이지가 추가되고 forward 방향이 설정된다', () => {
        const route = createMockRoute('Home', '/');

        store.push(route);

        expect(store.stack).toHaveLength(1);
        expect(store.direction).toBe('forward');
    });
});
```

**실행 결과**: ❌ 테스트 실패 (push 메서드가 아직 구현되지 않음)

### 2. Green: 테스트를 통과하는 최소한의 코드 작성
- 테스트를 통과시키는 최소한의 코드만 작성
- 완벽한 구현보다 빠른 피드백 우선

```typescript
// stores/modules/pageStack.ts
export const usePageStackStore = defineStore('pageStack', {
    state: (): PageStackState => ({
        stack: [],
        direction: 'forward',
        cachedViews: [],
        maxStackSize: 10,
    }),
    actions: {
        push(route: RouteLocationNormalized) {
            const pageData: PageData = {
                name: route.name as string,
                path: route.path,
                params: route.params as Record<string, any>,
                query: route.query as Record<string, any>,
                scrollY: 0,
                timestamp: Date.now(),
            };
            this.stack.push(pageData);
            this.direction = 'forward';
        },
    },
});
```

**실행 결과**: ✅ 테스트 통과

### 3. Refactor: 코드 개선
- 중복 제거, 가독성 향상
- 테스트는 계속 통과해야 함
- 아키텍처 규칙 준수 확인

```typescript
// 캐시 관리, 스택 크기 제한 등 추가 기능 구현
actions: {
    push(route: RouteLocationNormalized) {
        // 스택 크기 제한
        if (this.stack.length >= this.maxStackSize) {
            const oldest = this.stack.shift();
            if (oldest) {
                this.removeCachedView(oldest.name);
            }
        }

        const pageData: PageData = {
            name: route.name as string,
            path: route.path,
            params: route.params as Record<string, any>,
            query: route.query as Record<string, any>,
            scrollY: 0,
            timestamp: Date.now(),
        };

        this.stack.push(pageData);
        this.direction = 'forward';

        // 캐시 관리
        if (!this.cachedViews.includes(pageData.name)) {
            this.cachedViews.push(pageData.name);
        }
    },
}
```

**실행 결과**: ✅ 모든 테스트 통과 + 코드 개선 완료

### TDD 원칙
- 구현 코드를 작성하기 전에 반드시 테스트를 먼저 작성
- 테스트가 실패하는 것을 확인한 후 구현 시작
- 테스트를 통과하는 최소한의 코드만 작성
- 테스트 통과 후 리팩토링 진행
- 리팩토링 후에도 모든 테스트가 통과하는지 확인

### 레이어별 TDD 순서
1. **Repository Layer**: API 호출 검증
2. **State Layer**: 상태 변경 및 API 호출 액션 검증
3. **Service Layer** (선택적): 순수 비즈니스 로직 검증
4. **Controller Layer**: 컴포넌트 통합 테스트

## 필수 규칙

### 언어 및 명명
- 모든 테스트 설명(`describe`, `test`)은 한글로 작성
- 모든 주석은 한글로 작성
- BDD 스타일로 테스트 이름 작성 ("~할 때 ~한다" 형식)

```typescript
// ✅ 올바른 예
test('유효한 이메일과 비밀번호로 로그인 시 대시보드로 이동한다', async ({ page }) => {});

// ❌ 잘못된 예  
test('login test', async ({ page }) => {});
test('should login successfully', async ({ page }) => {});
```

### 테스트 구조
- AAA 패턴(Arrange-Act-Assert) 준수
- 각 단계 사이에 한 줄 공백으로 구분
- `afterEach`에서 `jest.clearAllMocks()` 호출

```typescript
test('새 페이지로 이동할 때 스택에 페이지가 추가되고 forward 방향이 설정된다', () => {
    const route = createMockRoute('Home', '/');

    store.push(route);

    expect(store.stack).toHaveLength(1);
    expect(store.direction).toBe('forward');
});
```

### Locator 우선순위 (접근성 우선)
1. Role과 접근성 속성: `getByRole('button', { name: '로그인' })`
2. 레이블 및 텍스트: `getByLabel('비밀번호')`, `getByText('계정 만들기')`
3. 플레이스홀더: `getByPlaceholder('이메일을 입력하세요')`
4. 테스트 ID (최후): `getByTestId('submit-button')`

### 비동기 처리
- 비동기 요소에는 `findBy*` 사용
- 요소의 부재 검증에는 `queryBy*` 사용

```typescript
// ✅ 올바른 비동기 처리
expect(await screen.findByRole('button')).toBeInTheDocument();
expect(screen.queryByText('에러메시지')).not.toBeInTheDocument();
```

## 권장사항

### 파일 구조
- 테스트 파일은 `.test.ts` 확장자 사용
- 파일명은 테스트 대상과 동일하게 명명
- `describe` 블록으로 기능별 그룹화

### Import 순서
```typescript
// 1. 외부 라이브러리
import { screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

// 2. @/stores
import useRootStore from '@/stores';
import useEsquareStore from '@/stores/modules/esquare';

// 3. @/components
import FeedItem from '@/components/esquare/FeedItem.vue';

// 4. @/mocks
import { mockArticleList } from '@/mocks/sample/esquare';

// 5. @/test
import { renderComponent } from '@test/setup';
```

### Mock 선언 순서
```typescript
// 1. jest.mock 선언
jest.mock('@/stores');
jest.mock('@/stores/modules/esquare');

// 2. jest.mocked 선언
const mockedUseRootStore = jest.mocked(useRootStore);
const mockedUseEsquareStore = jest.mocked(useEsquareStore);

// 3. jest.fn() 선언 (한 줄 공백 후)
const mockSetShareInfo = jest.fn();
const mockGoWithRouter = jest.fn();
```

## 절대 금지

### 금지된 Locator
- CSS 선택자 사용 (`.className`, `#id`)
- `querySelector` 또는 `querySelectorAll` 사용
- DOM 직접 접근 (`container.firstChild`)
- 복잡한 CSS 선택자

### 금지된 패턴
- Implementation details 테스트
- 컴포넌트 내부 state 직접 접근
- 영어로 테스트 설명 작성
- `expect` 구문에서 `getBy*` 직접 사용 (비동기 요소의 경우)

## 테스트 구조

```bash
test/
├── e2e/                                # Playwright E2E 테스트
├── integration/                        # Jest 통합 테스트
│   ├── components/                     # @/components 테스트
│   ├── views/                          # @/views 테스트
│   └── hooks/                          # Service 계층 통합 테스트
├── unit/                               # Jest 단위 테스트
│   ├── hooks/                          # @/hooks 테스트
│   │   └── product/                    # Product 도메인 Service 테스트
│   │       ├── business/               # 비즈니스 로직 단위 테스트
│   │       └── ui/                     # UI 로직 단위 테스트
│   ├── stores/                         # @/stores 테스트
│   │   ├── api/                        # API Store 테스트
│   │   └── modules/                    # Store 모듈 테스트
│   └── utils/                          # @/utils 테스트
├── mocks/                              # 목업 데이터
├── setup.ts                           # Jest 설정
└── global-setup.ts                    # Playwright 설정
```

## 실제 코드 예시

### Jest 통합 테스트
```typescript
describe('신규회원 배너 (NewMemberBanner)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('배너 데이터가 있을 때 배너 목록이 표시된다', async () => {
        const user = userEvent.setup();
        renderComponent(NewMemberBanner, {
            global: {
                provide: {
                    eapp: { ...globalProperties },
                },
            },
        });

        const bannerList = await screen.findAllByRole('button');
        
        expect(bannerList).toHaveLength(2);
        expect(bannerList[0]).toHaveTextContent('첫 배너');
    });
});
```

### Playwright E2E 테스트
```typescript
test.describe('와인 구매 프로세스', () => {
    test('와인 상품을 선택하고 수량을 조절하여 결제 페이지로 이동한다', async ({ page }) => {
        await page.goto('/wine');

        await page.getByRole('button', { name: '와인 선택' }).click();
        await page.getByRole('button', { name: '수량 증가' }).click();
        await page.getByRole('button', { name: '구매하기' }).click();

        await expect(page).toHaveURL(/.*payment/);
    });
});
```

## 테스트 실행 시 주의사항

### 환경변수 사용 금지
- 테스트 실행 시 `VUE_APP_API_URL` 등 환경변수 사용 금지
- 테스트는 모킹을 사용하므로 실제 API 엔드포인트 불필요
- MSW나 Jest Mock을 통해 API 응답 모킹

```bash
# ✅ 올바른 예 - 환경변수 없이 실행
npm test
npm test -- --testPathPattern="usePrice"
```

### 테스트 격리 원칙
- 각 테스트는 외부 의존성 없이 독립적으로 실행
- 모든 외부 API, Store, Service는 모킹 처리
- 테스트 간 상태 공유 금지

## 체크리스트

### 테스트 작성
- [ ] 모든 설명이 한글로 작성되었는가?
- [ ] BDD 스타일로 테스트명을 작성했는가?
- [ ] AAA 패턴이 명확히 구분되어 있는가?
- [ ] `getByRole`을 우선적으로 사용했는가?
- [ ] 비동기 요소에 `findBy*`를 사용했는가?
- [ ] CSS 선택자를 사용하지 않았는가?
- [ ] `afterEach`에서 mock을 정리했는가?
- [ ] Import 순서가 올바른가?

### TDD 프로세스
- [ ] 테스트를 먼저 작성했는가?
- [ ] 테스트가 실패하는 것을 확인했는가?
- [ ] 최소한의 코드로 테스트를 통과시켰는가?
- [ ] 리팩토링을 진행했는가?
- [ ] 리팩토링 후에도 모든 테스트가 통과하는가?
