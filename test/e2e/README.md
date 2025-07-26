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

# 특정 테스트만 실행
npm run test:e2e -- tests/login.spec.ts
```

## 브라우저 설치

```bash
# Playwright 브라우저 설치
npx playwright install
```
