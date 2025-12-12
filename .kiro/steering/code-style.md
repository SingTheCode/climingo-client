---
inclusion: always
---

# 코드 스타일 가이드

## 필수 규칙

### 중괄호 사용
모든 제어문(if, for, while 등)에서 중괄호를 반드시 사용합니다.

```typescript
// ✅ 올바른 예
if (a === 1) {
    return;
}

if (condition) {
    doSomething();
}

for (let i = 0; i < 10; i++) {
    process(i);
}

// ❌ 잘못된 예
if (a === 1) return;

if (condition) doSomething();

for (let i = 0; i < 10; i++) process(i);
```

**이유**:
- 코드 가독성 향상
- 디버깅 시 중단점 설정 용이
- 코드 추가 시 실수 방지
- 일관된 코드 스타일 유지

## 예외 사항

없음. 모든 제어문에서 중괄호를 사용합니다.

## 체크리스트

- [ ] 모든 if 문에 중괄호 사용
- [ ] 모든 for 문에 중괄호 사용
- [ ] 모든 while 문에 중괄호 사용
- [ ] 삼항 연산자는 간단한 경우에만 사용
- [ ] ESLint 규칙 통과
