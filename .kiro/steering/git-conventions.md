---
inclusion: always
---

# Git 커밋 메시지 컨벤션

## 필수 규칙

### 커밋 메시지 구조
- 제목은 50자 이내로 작성
- 제목과 본문 사이에 빈 줄 추가
- 제목은 명령형으로 작성 (동사로 시작)
- 제목 끝에 마침표 사용하지 않음
- 브랜치의 일감번호를 대괄호로 감싸서 커밋 메시지 앞에 표시

```bash
# ✅ 올바른 예
[SCRUM-12312] feat: 상품 검색 기능 추가

- SearchBar 컴포넌트 추가
- 검색 API 연동
- 검색 결과 페이지 구현

# ❌ 잘못된 예
added search feature.
feat: 상품 검색 기능 추가 (일감번호 누락)
```

### 커밋 타입
다음 타입 중 하나를 반드시 사용:

```bash
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 변경
style:    코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
refactor: 코드 리팩토링 (기능 변경 없음)
test:     테스트 코드 추가 또는 수정
chore:    빌드 스크립트, 패키지 관리 등
perf:     성능 개선
ci:       CI/CD 설정 변경
revert:   이전 커밋 되돌리기
```

### 스코프 (선택사항)
변경 사항의 영역을 명시:

```bash
[SCRUM-12312] feat(auth): 로그인 기능 구현
[SCRUM-12313] fix(product): 상품 상세 페이지 버그 수정
[SCRUM-12314] test(payment): 결제 모듈 단위 테스트 추가
```

### 한글 사용
- 커밋 메시지는 한글로 작성
- 의미가 명확하고 간결하게 작성

## 권장사항

### 본문 작성
- 변경 사항을 글머리 기호로 간결하게 나열
- 부연 설명이나 관련 이슈 번호는 제외
- 핵심적인 변경 내용만 포함

```bash
[SCRUM-12345] feat: 장바구니 수량 조절 기능 추가

- QuantityControl 컴포넌트 추가
- 장바구니 API 수량 업데이트 엔드포인트 연동
- 수량 변경 시 실시간 가격 업데이트
```

### Footer 정보 (특별한 경우에만)
- Breaking changes 표시 (필요 시에만)
- Co-authored-by 정보 (페어 프로그래밍 시에만)

```bash
[SCRUM-54321] feat: 새로운 결제 시스템 도입

- 결제 API 엔드포인트 변경
- 결제 플로우 UI 개선
- 결제 검증 로직 강화

BREAKING CHANGE: 기존 결제 API 제거됨
Co-authored-by: 홍길동 <hong@emart.com>
```

### 브랜치명과 일감번호 매핑
브랜치명에서 일감번호를 추출하여 커밋 메시지에 포함:

```bash
# 브랜치명 패턴: [브랜치Feature]/[일감번호]_[일감상세내용]
# 커밋 형식: [일감번호] [커밋타입]: [커밋내용]

# ✅ 올바른 예
브랜치명: feature/SCRUM-12312_test-commit-branch
커밋: [SCRUM-12312] feat: 커밋 테스트 브랜치

브랜치명: bugfix/#123_test-github-issue
커밋: [#123] docs: 문서 변경

브랜치명: hotfix/SCRUM-54321_urgent-payment-fix
커밋: [SCRUM-54321] fix: 긴급 결제 오류 수정
```

## EmartApp 특수 규칙

### 도메인별 스코프
```bash
[SCRUM-12312] feat(emart): 이마트 전용 기능
[SCRUM-12313] feat(traders): 트레이더스 전용 기능  
[SCRUM-12314] feat(wine): 와인샵 전용 기능
[SCRUM-12315] feat(common): 공통 기능
[SCRUM-12316] feat(mobile): 모바일 앱 연동
```

### 컴포넌트별 스코프
```bash
[SCRUM-12317] feat(component): UI 컴포넌트 관련
[SCRUM-12318] feat(store): Pinia 스토어 관련
[SCRUM-12319] feat(router): 라우터 설정 관련
[SCRUM-12320] feat(api): API 연동 관련
[SCRUM-12321] feat(mock): Mock 데이터 관련
```

### 테스트 관련
```bash
[SCRUM-12322] test(unit): 단위 테스트
[SCRUM-12323] test(integration): 통합 테스트
[SCRUM-12324] test(e2e): E2E 테스트
[SCRUM-12325] test(mock): 테스트용 목업
```

## 절대 금지

### 금지된 패턴
- 의미 없는 커밋 메시지 (`fix`, `update`, `change` 등)
- 여러 기능을 하나의 커밋에 포함
- WIP (Work In Progress) 커밋을 메인 브랜치에 푸시
- AI 도구 관련 부연 설명 포함

```bash
# ❌ 금지된 예시
fix
update
change
WIP
asdf
test

# ❌ 금지된 AI 도구 관련 내용
🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 커밋 크기
- 너무 큰 커밋 (파일 50개 이상 변경) 금지
- 너무 작은 커밋 (오타 수정을 별도 커밋으로) 금지

## 커밋 전 체크리스트

- [ ] 일감번호가 대괄호로 표시되었는가?
- [ ] 커밋 타입이 적절한가?
- [ ] 제목이 50자 이내인가?
- [ ] 한글로 명확하게 작성했는가?
- [ ] 하나의 기능/수정사항만 포함하는가?
- [ ] 테스트가 통과하는가?
- [ ] 린트 오류가 없는가?
- [ ] 변경 사항을 글머리 기호로 간결하게 나열했는가?

## 커밋 메시지 예시

### 기능 추가
```bash
[SCRUM-23456] feat(product): 상품 리뷰 작성 기능 추가

- ReviewWrite 컴포넌트 구현
- 이미지 업로드 기능 추가
- 평점 입력 UI 개발
- 리뷰 저장 API 연동
```

### 버그 수정
```bash
[SCRUM-23457] fix(cart): 장바구니 수량 0일 때 삭제되지 않는 버그 수정

- QuantityControl 컴포넌트 로직 수정
- 수량 0일 때 자동 삭제 처리 추가
- 관련 단위 테스트 추가
```

### 리팩토링
```bash
[SCRUM-23458] refactor(store): Vuex에서 Pinia로 사용자 스토어 마이그레이션

- useUserStore Pinia 스토어 생성
- 기존 Vuex user 모듈 제거
- 관련 컴포넌트 임포트 수정
- 타입 정의 업데이트

BREAKING CHANGE: userModule API 변경됨
```
