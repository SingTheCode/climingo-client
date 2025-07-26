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
```
