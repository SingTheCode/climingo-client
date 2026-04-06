# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-06
**Commit:** d6bd6a6
**Branch:** feature/sentry

## OVERVIEW

클라이밍 커뮤니티 웹앱. 찍볼(클라이밍 문제) 공유, 기록 추적, 클라이머 연결. Next.js 14 App Router + TypeScript + Tailwind CSS + Zustand + TanStack Query. 도메인 기반 수직 슬라이스 아키텍처.

## STRUCTURE

```
src/
├── app/                  # Next.js App Router (9 pages, 모두 "use client")
├── domains/              # ★ 핵심. 도메인별 수직 슬라이스 (→ domains/AGENTS.md)
│   ├── auth/             # 인증 (OAuth, 회원가입)
│   ├── jjikboul/         # 찍볼 (클라이밍 문제 공유)
│   ├── place/            # 장소 (클라이밍짐)
│   ├── profile/          # 프로필
│   └── record/           # 기록 (클라이밍 영상/기록)
├── components/           # 공유 UI (InputText, LayerPopup, FloatingButton, Avatar 등)
├── hooks/                # 공유 유틸 훅 (useDebounce, useIntersectionObserver 등 3개)
├── api/                  # fetchClient.ts만 존재 (글로벌 HTTP 클라이언트)
├── store/                # Zustand (user.tsx - persist 미들웨어)
├── lib/                  # async/, monitoring/ (Sentry)
├── utils/                # common.ts, eventEmitter.ts
├── types/                # 글로벌 타입 정의
├── reactQueryProvider.tsx
└── ServiceWorkerProvider.tsx
test/
├── unit/                 # Jest (hooks 5개, store 1개)
├── integration/          # Jest (components 1개)
├── e2e/                  # Playwright (구조만 준비됨)
├── mocks/                # Mock 데이터
├── helpers/              # renderWithProviders.tsx
└── templates/            # 테스트 템플릿 (hook, component)
```

## ROUTE MAP

```
/                         → 홈 피드 (기록 목록 + FAB 메뉴)
/signIn                   → OAuth 로그인 (Kakao, Apple)
/signUp                   → 닉네임 등록
/oauth                    → OAuth 콜백 핸들러
/profile                  → 내 프로필 + 기록 히스토리
/profile/detail           → 프로필 설정 (닉네임 편집, 로그아웃, 탈퇴)
/record/create            → 기록 생성 (영상 업로드)
/record/[recordId]        → 기록 상세 (동적)
/jjikboul/[jjikboulId]    → 찍볼 상세 (동적)
```

미들웨어, API 라우트, error/loading/not-found 바운더리 없음.

## WHERE TO LOOK

| 작업                 | 위치                            | 비고                                  |
| -------------------- | ------------------------------- | ------------------------------------- |
| 새 기능 추가         | `src/domains/{도메인}/`         | api→hooks→components→types 4개 레이어 |
| 공유 UI 컴포넌트     | `src/components/`               | 도메인 import 금지                    |
| HTTP 클라이언트 수정 | `src/api/fetchClient.ts`        | 401→clearUser+unAuthorized 이벤트     |
| 글로벌 상태          | `src/store/user.tsx`            | Zustand + persist                     |
| 라우팅 추가          | `src/app/{경로}/page.tsx`       | 모두 "use client"                     |
| 테스트 추가          | `test/{unit\|integration}/`     | 템플릿: `test/templates/`             |
| 아키텍처 규칙        | `docs/architecture/`            | hexagonal-rules, naming-conventions   |
| 코딩 표준            | `docs/development/`             | coding-standards, git-workflow        |
| 테스팅 가이드        | `docs/testing/testing-guide.md` | AAA 패턴, BDD 스타일                  |

## CONVENTIONS (프로젝트 고유)

### 언어 정책

- 커밋 메시지, 코드 주석, 테스트명, 에러 메시지: **무조건 한글**
- 커밋 형식: `[#이슈번호] type: 한글 설명`

### 의존성 흐름 (ESLint 강제)

```
Components → hooks (Service) → domain/api (Repository) → fetchClient (API Client)
```

- 컴포넌트가 Repository 직접 import 금지
- 도메인 간 직접 참조 금지 (ESLint no-restricted-imports)
- 공유 components/hooks에서 domains/ import 금지
- 상대경로 금지 → `@/` 절대경로만 사용

### Import 순서 (ESLint 강제)

React → 상태관리 → 외부라이브러리 → `@/lib` → `@/types` → `@/utils` → `@/hooks` → `@/api` → `@/store` → `@/components` → styles

### 네이밍

| 대상                | 패턴                                                     | 예시                         |
| ------------------- | -------------------------------------------------------- | ---------------------------- |
| Repository Query    | `use[Get\|Find][Entity][Detail\|List]Query`              | `useGetJjikbolDetailQuery`   |
| Repository Mutation | `use[Create\|Update\|Delete][Entity]Mutation`            | `useCreateJjikbolMutation`   |
| API Client          | `[get\|create\|update\|delete][Entity][Detail\|List]Api` | `getJjikbolDetailApi`        |
| Service Hook        | `use[Entity]`                                            | `useJjikbol`                 |
| Component           | `[Feature][Content][Type]`                               | `JjikbolShareDetail`         |
| Store               | `useXxxStore`                                            | `useUserStore`               |
| 불린 변수           | `is[State]` / `has[Something]`                           | `isLoading`, `hasPermission` |
| 상수                | `UPPER_SNAKE_CASE`                                       | `API_BASE_URL`               |
| Props               | `[Component]Props`                                       | `JjikbolShareDetailProps`    |

### 컴포넌트 내부 순서

1. Props 구조분해 → 2. 커스텀 훅 → 3. Zustand → 4. useState → 5. useRef → 6. useMemo → 7. useCallback → 8. 일반 함수 → 9. useEffect → 10. 조건부 렌더링 → 11. JSX

### 헬퍼 함수

- 단일 함수 내에서만 사용: `function` 키워드, 해당 스코프 최하단
- 2곳 이상 사용: `const` 화살표 함수, 전역 스코프

### 타입 패턴

- `[Entity]Response` → 서버 응답 (snake_case 그대로)
- `[Entity]` → 클라이언트 도메인 모델 (camelCase)
- `[Entity]Request` → 서버 요청
- `[Entity]Model()` → Response→Entity 변환 함수
- enum 대신 `const assertion` + `typeof` 사용

## ANTI-PATTERNS (이 프로젝트에서 금지)

- `any` 타입 사용
- 빈 catch 블록 `catch(e) {}`
- 프로덕션 코드에 `console.log`
- 인라인 스타일 (특별한 경우 제외)
- 하드코딩된 값 (상수로 정의)
- 기존 주석 삭제 (리팩토링 시에도 보존)
- 테스트에서 `querySelector`, `.className`, `#id` 선택자 사용
- 테스트에서 내부 state/props 직접 접근

## TAILWIND 커스텀

- Primary: `#FF5C75` (dark/light/lighter/lightest)
- Z-index: navigation(100) → dropdown(200) → overlay(300) → floating(400) → tooltip(500) → notification(600) → critical(900)
- Font: rem 기반 (2xs:1.0rem ~ 2xl:2.2rem)
- Level 색상: red, orange, yellow, green, blue, navy, purple, pink, brown, grey, white, black

## COMMANDS

```bash
npm run dev              # 개발 서버 (HTTPS, local.dev-app.climingo.xyz)
npm run stg              # 스테이징 (local.stg-app.climingo.xyz)
npm run prd              # 프로덕션 (local.app.climingo.xyz)
npm run build            # 프로덕션 빌드
npm run lint             # ESLint
npm run type-check       # TypeScript 타입 체크
npm run test:unit        # 유닛 테스트 (Jest)
npm run test:integration # 통합 테스트 (Jest)
npm run test:e2e         # E2E 테스트 (Playwright)
npm run test:all         # 전체 테스트
```

## NOTES

- API 서버: `https://api.climingo.xyz` (dev/prod 동일)
- 이미지: Kakao CDN + AWS S3 (climingo-api 버킷)
- 인증: OAuth (Kakao, Apple) → 401 시 자동 로그아웃 + 이벤트 발행
- Sentry 통합: silent 모드, 프로덕션 소스맵 숨김
- Docker: Node 20 Alpine, docker-compose로 로컬 개발 (climingo-network 필요)
- CI/CD: 미구성 (GitHub Actions 없음, 수동 배포)
- Husky + lint-staged: 커밋 시 자동 lint fix
- 테스트 커버리지 목표: 라인 80%, 함수 90%, 브랜치 75%
- `src/domains/` 구조가 실제 아키텍처. CLAUDE.md의 flat 구조 설명은 레거시 문서.
