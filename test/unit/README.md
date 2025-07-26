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
npm run test:unit -- hooks/useAuth.test.ts

# 감시 모드로 실행
npm run test:unit -- --watch
```
