---
activation_phrase: "{{ 브랜치이름 }} 로의 코드리뷰 진행해줘"
inclusion: on_match
---

# 브랜치 간 코드리뷰

사용자가 "{{ 브랜치이름 }} 로의 코드리뷰 진행해줘" 라고 요청하면:

## 1. 변경사항 확인
```bash
git diff {{ 브랜치이름 }}...HEAD
```

현재 브랜치에서 {{ 브랜치이름 }}으로 머지할 때 포함되는 변경사항만 확인

## 2. 커밋 목록 확인
```bash
git log {{ 브랜치이름 }}..HEAD --oneline
```

## 3. 코드리뷰 수행

### 아키텍처 준수
- [ ] 레이어 분리 (Controller/Service/State/Repository/Transform)
- [ ] 의존성 방향 (Controller → Service → State → Repository → Transform)
- [ ] 각 레이어 책임 준수

### 타입 안정성
- [ ] 타입 정의 (`types/[domain].d.ts`)
- [ ] Transform 함수의 완전한 타입 반환
- [ ] any 타입 사용 최소화

### 데이터 변환
- [ ] Transform 함수에서 옵셔널 체이닝 + Nullish Coalescing 사용
- [ ] 완전한 엔티티 객체 반환 보장
- [ ] Repository에서 Transform 함수 사용

### 상태 관리
- [ ] State에서만 상태 정의
- [ ] 로딩/에러 상태 관리
- [ ] Service에서 Store/ref/computed 사용 금지

### 보안
- [ ] 민감 정보 하드코딩 없음
- [ ] 사용자 입력 검증
- [ ] XSS 방지 (v-html 사용 시 sanitize)
- [ ] 개인정보 마스킹

### 코드 품질
- [ ] 명명 규칙 준수
- [ ] 중복 코드 제거
- [ ] 에러 처리
- [ ] 주석 및 문서화

### 커밋 메시지
- [ ] 일감번호 포함
- [ ] 커밋 타입 적절 (feat/fix/refactor/docs/test/chore)
- [ ] 변경사항 명확히 기술

## 4. 리뷰 결과 제공

각 변경 파일별로:
- 문제점 지적
- 개선 제안
- 칭찬할 부분

전체 요약:
- 주요 이슈
- 머지 가능 여부
- 추가 작업 필요 사항
