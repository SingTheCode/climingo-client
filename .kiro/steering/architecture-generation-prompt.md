---
inclusion: never
---

# 아키텍처 규칙 생성 프롬프트

이 프롬프트를 사용하면 신규 프로젝트의 기술 스택에 맞게 아키텍처 문서 3개를 자동 생성할 수 있습니다.

---

## 사용 방법

```
다음 기술 스택을 기반으로 프로젝트 아키텍처 규칙 문서 3개를 생성해주세요:

**기술 스택**: [프레임워크], [상태관리], [스타일링], [기타 라이브러리]

[아래 전체 프롬프트 내용 복사]
```

---

## 프롬프트

### 필수 규칙

1. **파일 크기**: 각 파일은 500줄을 넘지 않아야 함
2. **파일 분리**: 500줄 초과 시 연관 내용끼리 묶어 별도 파일로 추출
3. **기술 스택 반영**: 모든 예시 코드는 제시된 기술 스택 사용
4. **한글 작성**: 모든 설명은 한글로 작성 (코드 주석 포함)

### 기술 스택별 변환 규칙

**[프레임워크]에 따른 변환**:
- React → Vue: `useState` → `ref`, `useEffect` → `watchEffect`, `useContext` → `provide/inject`
- React → Svelte: `useState` → `writable`, `useEffect` → `$:`, Context → Store
- Next.js → Nuxt: `app/` → `pages/`, `'use client'` → `<script setup>`

**[상태관리]에 따른 변환**:
- TanStack Query → VueQuery: `useSuspenseQuery` → `useSuspenseQuery` (동일 API)
- TanStack Query → SWR: `useSuspenseQuery` → `useSWR` + Suspense
- Zustand → Pinia: `create` → `defineStore`, `useStore` → `useXxxStore`
- Zustand → Vuex: Store 구조를 Vuex 모듈 패턴으로 변환

**[비동기 처리]에 따른 변환**:
- React Suspense → Vue Suspense: `<Suspense>` 컴포넌트 사용 (동일 개념)
- React ErrorBoundary → Vue onErrorCaptured: 에러 처리 훅 사용
- AsyncBoundary 패턴은 모든 프레임워크에서 동일하게 적용

**[Context/상태 공유]에 따른 변환**:
- React Context API → Vue provide/inject: 같은 도메인 내부 상태 공유
- React Context API → Svelte Context: `setContext` / `getContext`
- Compound Component 패턴은 모든 프레임워크에서 동일하게 적용 (상태 공유 방식만 변경)

---

## architecture.md 전체 구조

```markdown
# [프로젝트명] Frontend Architecture Guide

> **기술 스택**: [제시된 기술 스택]

이 문서는 [프로젝트명] 프로젝트의 **아키텍처 강령(Architecture Guidelines)**입니다.  
모든 팀원은 코드 작성 시 이 규칙을 준수해야 하며, 코드 리뷰 시 이 문서를 기준으로 평가합니다.

---

## 1. 핵심 원칙 (Core Principles)

### 1.1 상태(Logic)와 뷰(UI)의 철저한 분리
- **Headless Hook**은 UI를 반환하지 않고 순수 로직만 담당합니다.
- **Compound Component**는 조립 가능한 UI 단위로 분리됩니다.
- 이 철학은 재사용성과 유연성을 극대화하며, 테스트 가능성을 높입니다.

### 1.2 도메인 주도 디렉토리 구조 (Domain-driven Directory)
- "함께 수정되는 파일은 같은 위치에 둔다(Collocation)" 원칙을 따릅니다.
- 기술적 분류(`components/`, `hooks/`)가 아닌 **기능적 분류**(`domains/`)를 우선합니다.
- 비즈니스 로직은 도메인별로 격리되어야 합니다.

### 1.3 선언적 비동기 처리 (Declarative Async Handling)
- 컴포넌트 내부에서는 **성공한 데이터만 다룹니다**.
- `Suspense`와 에러 처리를 조합하여 로딩/에러 처리를 선언적으로 관리합니다.
- [기술 스택의 비동기 처리 방식]을 사용하여 컴포넌트 내부에 `isLoading`, `isError` 분기를 제거합니다.

### 1.4 단일 책임 원칙 (Single Responsibility Principle)
- 컴포넌트는 '데이터 관리(Logic)'와 'UI 렌더링(View)' 중 **하나의 역할만** 수행합니다.
- 상태 관리 로직은 반드시 `use[FeatureName]` 형태의 커스텀 훅으로 추출합니다.

---

## 2. 표준 디렉토리 구조 (Directory Structure)

[제시된 프레임워크에 맞는 디렉토리 구조 작성]

**예시 (Next.js)**:
\`\`\`
src/
├── app/                          # 🎯 Controller Layer
│   ├── [route]/
│   │   └── page.tsx              # 도메인 조립 및 라우팅
│   └── layout.tsx
│
├── domains/                      # 🏗️ Domain Layer
│   └── [domain]/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       │   ├── [domain]Api.ts
│       │   └── transform.ts
│       └── types/
│           ├── entity.ts
│           └── response.ts
│
├── components/                   # 🧩 Shared UI Components
├── hooks/                        # 🔧 Shared Hooks
├── types/                        # 📦 Shared Types
├── store/                        # 🗄️ Global State
├── api/                          # 🌐 API Client
├── utils/                        # 🛠️ Utilities
└── lib/                          # ⚙️ External Library Config
\`\`\`

**아키텍처 핵심**:
- **Controller**: 도메인을 조립하고 라우팅
- **Domain**: 비즈니스 로직 격리, 도메인 간 직접 참조 금지
- **Shared**: 도메인 독립적인 공통 요소

---

## 3. 세부 규칙 (Detailed Rules)

> 📖 **상세 내용**: [아키텍처 세부 규칙 (architecture-rules.md)](./architecture-rules.md)

**Rule 요약**:
- **Rule 1**: Headless Hook - UI와 분리된 로직 관리
- **Rule 2**: Compound Component - [상태 공유 방식] 기반 조립 가능한 UI
- **Rule 3**: Funnel 패턴 - 다단계 플로우 관리
- **Rule 4**: Api - API 통신만 담당
- **Rule 5**: 레이어 간 의존성 - 단방향 의존성 흐름
- **Rule 6**: 선언적 비동기 처리 - [기술 스택의 비동기 처리 방식]
- **Rule 7**: 파일 네이밍 및 위치 - 일관된 명명 규칙

### 도메인 격리 (Domain Isolation)

**정의**: 서로 다른 도메인 간의 직접 참조를 지양하고, 상위 레벨에서 조립

> 📖 **상세 내용**: [도메인 격리 규칙 (architecture-domain-isolation.md)](./architecture-domain-isolation.md)

**핵심 원칙**:
- 도메인 간 직접 import 금지
- 식별자만 전달 (객체 전달 지양)
- Page 레벨에서 조립
- [상태 공유 방식]는 같은 도메인 내부 UI 상태 관리에만 사용

---

### Rule 8. 파일 네이밍 및 위치

**Headless Hook**:
- 네이밍: `use[Domain][Action]` (예: `useRecordCreate`, `useUserProfile`)
- 위치: `domains/[domain]/hooks/`

**Compound Component**:
- Root: `[Component].[확장자]` (예: `Select.tsx`, `Select.vue`)
- 하위: `[Component][Part].[확장자]`
- 위치: `components/[category]/`

**Api**:
- 네이밍: `[domain]Api`
- 위치: `domains/[domain]/api/`

**API Hook**:
- 네이밍: `use[Domain][Action]Query` 또는 `use[Domain][Action]Mutation`
- 위치: `domains/[domain]/hooks/`

**Import 경로 규칙**:
- **모든 import는 절대경로(`@/`)를 사용**
- 도메인 내부 파일 간 참조도 절대경로 사용 (상대경로 금지)

**Controller (Page)**:
- 위치: [프레임워크에 맞는 페이지 위치]
- 네이밍: `[Feature]Page` (default export)

---

## 4. 안티 패턴 (Anti-Patterns) 🚫

### ❌ Anti-Pattern 1: Headless Hook에서 UI 반환
[제시된 기술 스택으로 작성된 금지 예시]

### ❌ Anti-Pattern 2: Compound Component에서 비즈니스 로직
[제시된 기술 스택으로 작성된 금지 예시]

### ❌ Anti-Pattern 3: 단계 컴포넌트에서 다음 단계 이동
[제시된 기술 스택으로 작성된 금지 예시]

### ❌ Anti-Pattern 4: Controller에서 Api 직접 호출
[제시된 기술 스택으로 작성된 금지 예시]

### ❌ Anti-Pattern 5: 도메인 전용 Hook을 공통 폴더에 배치
[제시된 기술 스택으로 작성된 금지 예시]

### ❌ Anti-Pattern 6: Prop Drilling (5단계 이상)
[제시된 기술 스택으로 작성된 금지 예시 및 해결 방법]

### ❌ Anti-Pattern 7: UI 컴포넌트에서 직접 fetch
[제시된 기술 스택으로 작성된 금지 예시 및 해결 방법]

### ❌ Anti-Pattern 8: 컴포넌트 내부에서 로딩/에러 분기
[제시된 기술 스택으로 작성된 금지 예시 및 해결 방법]

### ❌ Anti-Pattern 9: [상태 공유 방식]로 도메인 간 데이터 공유
[제시된 기술 스택으로 작성된 금지 예시 및 해결 방법]

### ❌ Anti-Pattern 10: Props Drilling 회피를 위한 무분별한 [상태 공유 방식] 사용
[제시된 기술 스택으로 작성된 금지 예시 및 해결 방법]

---

## 5. 코드 리뷰 기준

Pull Request 승인 전 다음 항목을 필수로 확인:

### 5.1 Headless Hook
- [ ] Headless Hook이 UI를 반환하지 않는가?
- [ ] 비즈니스 로직이 Hook에 집중되어 있는가?
- [ ] 파일이 올바른 위치에 배치되었는가?

### 5.2 Compound Component
- [ ] Compound Component가 비즈니스 로직을 포함하지 않는가?
- [ ] [상태 공유 방식]를 통해 상태를 공유하는가?
- [ ] Root Component에서만 Headless Hook을 호출하는가?

### 5.3 Funnel 패턴
- [ ] 각 단계 컴포넌트가 다음 단계 이동 로직을 포함하지 않는가?
- [ ] 상위 Controller에서 전체 플로우를 관리하는가?
- [ ] URL 기반 상태 관리를 사용하는가?

### 5.4 비동기 처리
- [ ] [기술 스택의 비동기 처리 방식]을 사용하는가?
- [ ] 로딩/에러 처리를 선언적으로 관리하는가?
- [ ] 컴포넌트 내부에 `isLoading`, `isError` 분기가 없는가?

### 5.5 레이어 간 의존성
- [ ] Controller가 Api를 직접 호출하지 않는가?
- [ ] 도메인 간 직접 참조가 없는가?
- [ ] 파일이 올바른 위치에 배치되었는가?

### 5.6 네이밍 규칙
- [ ] 명명 규칙을 준수하는가?
- [ ] 파일명과 함수명이 일관성 있는가?

---

## 6. 기술 스택별 가이드

[제시된 각 기술 스택별 권장 사용법 작성]

**예시 구조**:
### 6.1 [프레임워크]
- 주요 기능 및 권장 사용법

### 6.2 [상태관리]
- 주요 기능 및 권장 사용법

### 6.3 [스타일링]
- 주요 기능 및 권장 사용법

---

## 7. 참고 자료

- [제시된 기술 스택 관련 공식 문서 링크]
- [Toss Frontend Architecture](https://toss.tech/article/frontend-architecture)
- [Headless UI Patterns](https://www.patterns.dev/posts/headless-ui)

---

**마지막 업데이트**: [날짜]  
**버전**: 1.0.0
```

---

## architecture-rules.md 전체 구조

```markdown
# 아키텍처 세부 규칙 (Architecture Rules)

이 문서는 [프로젝트명] 프로젝트의 세부 아키텍처 규칙을 정의합니다.

---

## Rule 1. Headless Hook의 책임

**정의**: UI와 완전히 분리된 로직과 상태 관리 Hook

**허용**:
- [기술 스택의 상태 관리 Hook] 사용 (예: React의 `useState`, Vue의 `ref`)
- Api Hook 직접 호출
- 비즈니스 로직 처리
- 상태와 액션 함수 반환

**금지**:
- UI 컴포넌트 반환
- DOM 조작
- 스타일 관련 로직

**위치**:
- 공통 로직: `hooks/` (도메인 독립적)
- 도메인 로직: `domains/[domain]/hooks/use[UseCase].ts`

**예시**:
[제시된 기술 스택으로 작성된 코드 예시]
- ✅ 올바른 예시: Headless Hook 구현
- ❌ 금지된 예시: UI 반환

---

## Rule 2. Compound Component의 책임

**정의**: [상태 공유 방식]을 활용해 상태를 공유하는 조립 가능한 컴포넌트

**구조**:
- **Root Component**: [상태 공유 방식] Provider 역할, Headless Hook 호출
- **하위 컴포넌트**: [상태 공유 방식]에서 필요한 상태/함수만 가져와 UI 렌더링

**허용**:
- [상태 공유 방식]에서 필요한 상태/함수만 가져옴
- UI 렌더링 및 이벤트 핸들링
- `children` prop을 통한 조합

**금지**:
- 비즈니스 로직 포함
- 직접 상태 관리 ([상태 공유 방식] 외)
- API 직접 호출

**위치**: `components/[Component]/`

**예시**:
[제시된 기술 스택으로 작성된 코드 예시]
- ✅ 올바른 예시: Select 컴포넌트 (Root, Trigger, Option)
- ❌ 금지된 예시: 비즈니스 로직 포함

---

## Rule 3. Funnel 패턴의 책임

**정의**: 다단계 플로우를 상위 Controller에서 선언적으로 관리

**허용**:
- 전체 플로우 정의 (`steps` 배열)
- 단계 간 데이터 전달 (`onNext` 콜백)
- 최종 제출 로직 (`onFinish`)
- URL 기반 상태 관리 (Query Parameter)

**금지**:
- 각 단계 컴포넌트에서 다음 단계 이동 로직 포함
- 단계 컴포넌트에서 라우터 직접 사용

**위치**:
- Controller: [프레임워크의 페이지 위치]
- 단계 컴포넌트: [프레임워크의 페이지 위치]/steps/
- Funnel Hook: `lib/funnel/useFunnel.ts`

**예시**:
[제시된 기술 스택으로 작성된 코드 예시]
- ✅ 올바른 예시: SignUpPage Controller
- ❌ 금지된 예시: 단계 컴포넌트에서 라우터 사용

---

## Rule 4. Api의 책임

**정의**: API 통신만 담당

**허용**:
- `fetch`, `axios` 호출
- HTTP 요청/응답 처리
- Transform 함수 호출 (각 도메인 내부에서 Response → Entity 변환)

**금지**:
- 비즈니스 로직
- 상태 관리
- 변환 로직 직접 구현 (별도 Transform 함수로 분리)

**위치**: `domains/[domain]/api/`

**예시**:
[제시된 기술 스택으로 작성된 코드 예시]
- ✅ 올바른 예시: recordApi.getRecordList + Transform 함수
- ❌ 금지된 예시: API에서 비즈니스 로직 처리

---

## Rule 5. 레이어 간 의존성

**허용되는 의존성**:
- **Controller (Page)** → Headless Hook 호출, Funnel 사용
- **Headless Hook** → Api/API Hook 호출
- **Compound Component Root** → Headless Hook 호출
- **Api** → Transform 함수 호출

**금지되는 의존성**:
- Controller에서 Api 직접 호출
- Compound Component에서 Api 직접 호출
- Api에서 Headless Hook 호출

**의존성 흐름**:
\`\`\`
Controller (Page)
    ↓
Headless Hook
    ↓
Api/API Hook
    ↓
API Module
\`\`\`

---

## Rule 6. 선언적 비동기 처리

**정의**: `Suspense`와 에러 처리를 조합하여 로딩/에러 처리를 선언적으로 관리

**허용**:
- [기술 스택의 비동기 처리 방식] 사용
- AsyncBoundary 패턴 사용
- 컴포넌트 내부에서 데이터가 무조건 존재한다고 가정

**금지**:
- 컴포넌트 내부에서 `isLoading`, `isError` 분기 처리
- [기술 스택의 생명주기 Hook] 내부에서 데이터 fetch 후 상태로 관리
- 컴포넌트 내부에서 `if (!data) return null;` 방어 코드

**예시**:
[제시된 기술 스택으로 작성된 코드 예시]
- ✅ 올바른 예시: AsyncBoundary + [비동기 처리 방식]
- ❌ 금지된 예시: 컴포넌트 내부 로딩/에러 분기

---

## Rule 7. 파일 네이밍 및 위치

**Headless Hook**:
- 네이밍: `use[Domain][Action]` (예: `useRecordCreate`, `useUserProfile`)
- 위치: `domains/[domain]/hooks/`

**Compound Component**:
- Root: `[Component].[확장자]`
- 하위: `[Component][Part].[확장자]`
- 위치: `components/[category]/`

**Api**:
- 네이밍: `[domain]Api`
- 위치: `domains/[domain]/api/`

**API Hook**:
- 네이밍: `use[Domain][Action]Query` 또는 `use[Domain][Action]Mutation`
- 위치: `domains/[domain]/hooks/`

**Import 경로 규칙**:
- **모든 import는 절대경로(`@/`)를 사용**
- 도메인 내부 파일 간 참조도 절대경로 사용 (상대경로 금지)

**[프레임워크별 ESLint 규칙]**:
[제시된 기술 스택에 맞는 ESLint 규칙 예시]

**Controller (Page)**:
- 위치: [프레임워크의 페이지 위치]
- 네이밍: `[Feature]Page` (default export)
```

---

## architecture-domain-isolation.md 전체 구조

```markdown
# 도메인 격리 규칙 (Domain Isolation)

**정의**: 서로 다른 도메인 간의 직접 참조를 지양하고, 상위 레벨에서 조립

---

## 1. 3단계 의사결정 트리

도메인 간 데이터가 필요할 때 다음 순서로 판단:

\`\`\`
도메인 간 데이터 필요?
│
├─ 1단계: 구조 재설계 검토
│   └─ "정말 이 도메인이 다른 도메인을 알아야 하나?"
│   └─ 대부분 여기서 해결 (식별자만 전달)
│
├─ 2단계: 서버 상태 공유 ([상태관리 라이브러리])
│   └─ API가 필요한 데이터를 한 번에 반환
│   └─ 도메인 간 직접 참조 없이 해결
│
└─ 3단계: Page 레벨 조립
    └─ 페이지에서 여러 도메인 데이터를 fetch
    └─ 필요한 데이터만 Props로 전달
\`\`\`

---

## 2. 허용/금지 사항

**허용**:
- 같은 도메인 내부의 파일 간 참조
- `components/common/`의 공통 컴포넌트 참조
- `types/common.ts`의 공통 타입 참조
- 상위 페이지에서 여러 도메인 조합

**금지**:
- `domains/record/`에서 `domains/profile/` 직접 import
- 도메인 전용 Hook을 다른 도메인에서 사용
- [상태 공유 방식]로 도메인 간 데이터 공유

---

## 3. 실전 패턴

### 패턴 1: 식별자만 전달 (가장 권장)

[제시된 기술 스택으로 작성된 코드 예시]

### 패턴 2: 서버 상태 공유 ([상태관리 라이브러리])

[제시된 기술 스택으로 작성된 코드 예시]

### 패턴 3: Page 레벨 조립

[제시된 기술 스택으로 작성된 코드 예시]

---

## 4. Props Drilling 판단 기준

Props Drilling은 문제가 아니라 구조가 잘못된 신호

| Props 깊이 | 판단 | 조치 |
|-----------|------|------|
| **2~3단계** | 정상 | 그대로 유지 (명확하고 추적 가능) |
| **4단계** | 주의 | 컴포넌트 구조 재검토 |
| **5단계 이상** | 문제 | 컴포넌트 분리 또는 Compound Component 패턴 적용 |

[제시된 기술 스택으로 작성된 코드 예시]

---

## 5. [상태 공유 방식] 사용 기준

**중요**: [상태 공유 방식]는 도메인 간 데이터 공유가 아닌, **같은 도메인 내부의 UI 상태 관리**에만 사용

**✅ [상태 공유 방식] 사용이 적절한 경우**:
- 같은 도메인 내부의 UI 상태 (탭 선택, 펼침/접힘 등)
- Compound Component 패턴의 내부 상태
- 테마, 언어 설정 등 전역 UI 설정

**❌ [상태 공유 방식] 사용이 부적절한 경우**:
- 도메인 간 데이터 전달
- 비즈니스 로직 공유
- API 응답 데이터 공유 ([상태관리 라이브러리] 사용)

[제시된 기술 스택으로 작성된 코드 예시]

---

## 6. 도메인 간 의존성 해결

**원칙**: 1개의 도메인이 다른 1개의 도메인을 의존하면, 2개를 포괄하는 도메인을 생성

**시나리오**: `auth`와 `profile`이 서로 의존하는 경우

[제시된 기술 스택으로 작성된 금지 패턴]

**✅ 해결: 포괄 도메인 생성**

\`\`\`
domains/
├── user/                         # auth + profile을 포괄하는 도메인
│   ├── components/
│   ├── hooks/
│   │   ├── useUser.ts           # 통합된 사용자 로직
│   │   └── useUserAuth.ts       # 인증 관련
│   ├── api/
│   │   ├── userApi.ts
│   │   └── transform.ts
│   └── types/
│       └── entity.ts
├── record/
└── place/
\`\`\`

**통합 예시**:
[제시된 기술 스택으로 작성된 코드 예시]

---

## 7. 금지된 패턴

[제시된 기술 스택으로 작성된 금지 코드 예시]

---

## 8. 체크리스트

구현하면서 이것들을 확인하세요:

[제시된 기술 스택으로 작성된 체크리스트]
```

