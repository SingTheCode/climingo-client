# E2E Tests

이 디렉토리는 Playwright를 사용한 End-to-End 테스트를 포함합니다.

## 디렉토리 구조

- `tests/` - E2E 테스트 파일들
- `fixtures/` - 테스트용 고정 데이터 (JSON, 이미지 등)
- `utils/` - E2E 테스트 전용 유틸리티

## 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# 특정 브라우저에서만 실행
npm run test:e2e -- --project=chromium

# UI 모드로 실행
npm run test:e2e -- --ui

# 디버그 모드로 실행
npm run test:e2e -- --debug

# 특정 테스트만 실행
npm run test:e2e -- tests/login.spec.ts

# 특정 태그가 있는 테스트만 실행
npm run test:e2e -- --grep="로그인"
```

## 브라우저 설치

```bash
# Playwright 브라우저 설치
npx playwright install
```

## 테스트 작성 가이드

### 기본 구조

```typescript
import { test, expect } from "@playwright/test";

test.describe("로그인 플로우", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto("/signIn");
  });

  test("유효한 자격증명으로 로그인 시 대시보드로 이동한다", async ({
    page,
  }) => {
    // 테스트 로직
  });
});
```

### AAA 패턴 준수

모든 테스트는 Arrange-Act-Assert 패턴을 따릅니다:

```typescript
test("사용자가 로그인할 수 있어야 한다", async ({ page }) => {
  // Arrange (준비)
  await page.goto("/signIn");

  // Act (실행)
  await page.fill('[data-testid="email-input"]', "test@example.com");
  await page.fill('[data-testid="password-input"]', "password123");
  await page.click('[data-testid="login-button"]');

  // Assert (검증)
  await expect(page).toHaveURL("/");
  await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
});
```

### BDD 스타일 테스트 설명

```typescript
// ❌ 잘못된 예
test("login test", async ({ page }) => {});
test("should navigate to dashboard", async ({ page }) => {});

// ✅ 좋은 예
test("유효한 이메일과 비밀번호로 로그인 시 대시보드로 이동한다", async ({
  page,
}) => {});
test("잘못된 이메일로 로그인 시 에러 메시지가 표시되어야 한다", async ({
  page,
}) => {});
```

### 테스트 단계 구분

```typescript
test("상품 구매 프로세스", async ({ page }) => {
  await test.step("상품 페이지 진입", async () => {
    await page.goto("/products/1");
    await expect(page).toHaveURL("/products/1");
  });

  await test.step("장바구니에 추가", async () => {
    await page.getByRole("button", { name: "장바구니 추가" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "장바구니에 추가되었습니다"
    );
  });

  await test.step("결제 페이지로 이동", async () => {
    await page.getByRole("link", { name: "결제하기" }).click();
    await expect(page).toHaveURL("/checkout");
  });
});
```

### Locator 전략

접근성을 우선으로 하는 Locator 사용을 권장합니다:

```typescript
// 1. Role과 접근성 속성 (최우선)
page.getByRole("button", { name: "로그인" });
page.getByLabel("이메일");
page.getByRole("textbox", { name: "비밀번호" });

// 2. 텍스트 및 기타
page.getByText("계정 만들기");
page.getByPlaceholder("이메일을 입력하세요");

// 3. 테스트 ID (최후의 수단)
page.getByTestId("submit-button");

// ❌ 금지된 방식
page.locator(".login-btn");
page.locator("div > button");
document.querySelector(".login-form");
```

## 검증(Assertions) 가이드

### 기본 검증

```typescript
// 요소 상태 검증
await expect(page.getByRole("button")).toBeEnabled();
await expect(page.getByRole("alert")).toBeVisible();

// 텍스트 검증
await expect(page.getByRole("heading")).toHaveText("환영합니다");

// URL 검증
await expect(page).toHaveURL(/.*dashboard/);

// 다중 요소 검증
await expect(page.getByRole("listitem")).toHaveCount(3);
```

### 비동기 검증

```typescript
// 요소가 나타날 때까지 대기
await expect(page.getByText("비동기 데이터")).toBeVisible();

// 요소가 사라질 때까지 대기
await expect(page.getByText("로딩 중...")).not.toBeVisible();

// 조건이 만족될 때까지 대기
await expect(async () => {
  const count = await page.getByRole("listitem").count();
  expect(count).toBeGreaterThan(0);
}).toPass();
```

## 모킹 전략

### API 모킹

```typescript
test("API 에러 발생 시 에러 메시지 표시", async ({ page }) => {
  await page.route("**/api/users", (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "서버 오류가 발생했습니다." }),
    });
  });

  await page.goto("/users");
  await expect(page.getByRole("alert")).toHaveText("서버 오류가 발생했습니다.");
});
```

### 네트워크 요청 모니터링

```typescript
test("API 호출이 올바르게 이루어져야 한다", async ({ page }) => {
  const apiCallPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/login") && response.status() === 200
  );

  await page.goto("/signIn");
  await page.fill('[data-testid="email-input"]', "test@example.com");
  await page.fill('[data-testid="password-input"]', "password123");
  await page.click('[data-testid="login-button"]');

  const response = await apiCallPromise;
  const responseBody = await response.json();
  expect(responseBody.token).toBeDefined();
});
```

## 인증 상태 관리

### 인증이 필요한 테스트에서 사용 (storageState)

```typescript
import { test } from "@playwright/test";

test.use({ storageState: "test/e2e/fixtures/auth.json" });

test("인증이 필요한 페이지 접근", async ({ page }) => {
  await page.goto("/dashboard");
  // ... 테스트 로직
});
```

### 인증 상태 생성

```typescript
// test/e2e/utils/auth.ts
import { test as setup, expect } from "@playwright/test";

setup("인증 상태 생성", async ({ page }) => {
  await page.goto("/signIn");
  await page.fill('[data-testid="email-input"]', "test@example.com");
  await page.fill('[data-testid="password-input"]', "password123");
  await page.click('[data-testid="login-button"]');

  // 로그인 성공 확인
  await expect(page).toHaveURL("/");

  // 인증 상태 저장
  await page.context().storageState({ path: "test/e2e/fixtures/auth.json" });
});
```

## 테스트 데이터 관리

### Fixtures 사용

```typescript
// test/e2e/fixtures/test-user.json
{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "테스트 사용자"
}

// 테스트에서 사용
import testUser from '../fixtures/test-user.json';

test('사용자 정보로 로그인', async ({ page }) => {
  await page.goto('/signIn');
  await page.fill('[data-testid="email-input"]', testUser.email);
  await page.fill('[data-testid="password-input"]', testUser.password);
  await page.click('[data-testid="login-button"]');
});
```

### 파일 업로드 테스트

```typescript
test("파일 업로드 기능", async ({ page }) => {
  await page.goto("/upload");

  // 파일 업로드
  await page.setInputFiles(
    '[data-testid="file-input"]',
    "test/e2e/fixtures/sample-image.png"
  );

  // 업로드 완료 확인
  await expect(page.getByText("업로드 완료")).toBeVisible();
});
```

## 특수 케이스 테스트

### 모바일 테스트

```typescript
test("모바일에서 로그인", async ({ page }) => {
  // 모바일 뷰포트 설정
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto("/signIn");

  // 모바일 특화 동작 테스트
  await page.getByRole("button", { name: "키보드 열기" }).click();
  await page.fill('[data-testid="email-input"]', "test@example.com");
});
```

### 다중 브라우저 테스트

```typescript
test.describe("크로스 브라우저 테스트", () => {
  test("Chrome에서 로그인", async ({ page }) => {
    await page.goto("/signIn");
    // Chrome 특화 테스트
  });

  test("Firefox에서 로그인", async ({ page }) => {
    await page.goto("/signIn");
    // Firefox 특화 테스트
  });

  test("Safari에서 로그인", async ({ page }) => {
    await page.goto("/signIn");
    // Safari 특화 테스트
  });
});
```

### 성능 테스트

```typescript
test("페이지 로딩 성능", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("/dashboard");

  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForLoadState("networkidle");

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // 3초 이내 로딩
});
```

## 체크리스트

테스트 작성 시 다음 사항을 확인하세요:

- [ ] 테스트 이름이 한글이고 BDD 스타일인가?
- [ ] AAA 패턴이 명확히 구분되어 있는가?
- [ ] getByRole을 우선적으로 사용했는가?
- [ ] 비동기 처리가 올바르게 되어 있는가?
- [ ] 모든 테스트 설명이 한글로 작성되었는가?
- [ ] 사용자 관점에서 테스트를 작성했는가?
- [ ] 테스트가 독립적으로 실행 가능한가?
- [ ] 적절한 대기 시간이 설정되어 있는가?

## 금지사항

### 절대 사용하지 말 것

- querySelector 또는 querySelectorAll
- 클래스명 기반 선택자 (.className)
- ID 기반 선택자 (#id)
- 복잡한 CSS 선택자
- document.querySelector 등 DOM 직접 접근

### 지양해야 할 패턴

- 과도한 대기 시간 (page.waitForTimeout)
- 하드코딩된 선택자
- 테스트 간 의존성
- 불필요한 스크린샷/비디오 캡처
