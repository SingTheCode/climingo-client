# Climingo Frontend Architecture Guide

> **기술 스택**: Next.js 14 (App Router), React 18, TypeScript, TanStack Query, Zustand, Tailwind CSS, Headless UI

이 문서는 Climingo 프로젝트의 **아키텍처 강령(Architecture Guidelines)**입니다.  
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
- `Suspense`와 `ErrorBoundary`를 조합하여 로딩/에러 처리를 선언적으로 관리합니다.
- `useSuspenseQuery`를 사용하여 컴포넌트 내부에 `isLoading`, `isError` 분기를 제거합니다.

### 1.4 단일 책임 원칙 (Single Responsibility Principle)
- 컴포넌트는 '데이터 관리(Logic)'와 'UI 렌더링(View)' 중 **하나의 역할만** 수행합니다.
- 상태 관리 로직은 반드시 `use[FeatureName]` 형태의 커스텀 훅으로 추출합니다.

---

## 2. 표준 디렉토리 구조 (Directory Structure)

```
src/
├── app/                          # 🎯 Controller Layer (Next.js App Router)
│   ├── [route]/
│   │   └── page.tsx              # 도메인 조립 및 라우팅
│   └── layout.tsx
│
├── domains/                      # 🏗️ Domain Layer (비즈니스 로직 격리)
│   └── [domain]/                 # 예: auth, record, profile, place, user
│       ├── components/           # UI 컴포넌트 (도메인 전용)
│       ├── hooks/                # Headless Hook (로직)
│       ├── api/                  # API 통신
│       │   ├── [domain]Api.ts
│       │   └── transform.ts      # Response → Entity 변환
│       ├── types/                # 타입 정의 (도메인 내부용)
│       │   ├── entity.ts         # 도메인 엔티티
│       │   └── response.ts       # API 응답 타입
│
├── components/                   # 🧩 Shared UI Components (도메인 독립적)
│   ├── button/
│   ├── input/
│   └── popup/
│
├── hooks/                        # 🔧 Shared Hooks (도메인 독립적)
├── types/                        # 📦 Shared Types (모든 도메인이 공통으로 사용)
├── store/                        # 🗄️ Global State (Zustand)
├── api/                          # 🌐 API Client (Fetch)
├── utils/                        # 🛠️ Utilities
└── lib/                          # ⚙️ External Library Config
```

**아키텍처 핵심**:
- **Controller (app/)**: 도메인을 조립하고 라우팅
- **Domain (domains/)**: 비즈니스 로직 격리, 도메인 간 직접 참조 금지
- **Shared (components/, hooks/, types/)**: 도메인 독립적인 공통 요소 (shared 폴더 없음)

---

## 3. 세부 규칙 (Detailed Rules)

> 📖 **상세 내용**: [아키텍처 세부 규칙 (architecture-rules.md)](./architecture-rules.md)

**Rule 요약**:
- **Rule 1**: Headless Hook - UI와 분리된 로직 관리
- **Rule 2**: Compound Component - Context 기반 조립 가능한 UI
- **Rule 3**: Funnel 패턴 - 다단계 플로우 관리
- **Rule 4**: Api - API 통신만 담당
- **Rule 5**: 레이어 간 의존성 - 단방향 의존성 흐름
- **Rule 6**: 선언적 비동기 처리 - Suspense + ErrorBoundary
- **Rule 7**: 파일 네이밍 및 위치 - 일관된 명명 규칙

### 도메인 격리 (Domain Isolation)

**정의**: 서로 다른 도메인 간의 직접 참조를 지양하고, 상위 레벨에서 조립

> 📖 **상세 내용**: [도메인 격리 규칙 (architecture-domain-isolation.md)](./architecture-domain-isolation.md)

**핵심 원칙**:
- 도메인 간 직접 import 금지
- 식별자만 전달 (객체 전달 지양)
- Page 레벨에서 조립
- Context는 같은 도메인 내부 UI 상태 관리에만 사용

---

### Rule 8. 파일 네이밍 및 위치

**Headless Hook**:
- 네이밍: `use[Domain][Action]` (예: `useRecordCreate`, `useUserProfile`)
- 위치: `domains/[domain]/hooks/`

**Compound Component**:
- Root: `[Component].tsx` (예: `Select.tsx`)
- 하위: `[Component][Part].tsx` (예: `SelectTrigger.tsx`, `SelectOption.tsx`)
- 위치: `components/[category]/` (예: `components/button/`, `components/input/`, `components/popup/`)

**Api**:
- 네이밍: `[domain]Api` (예: `recordApi`, `userApi`)
- 위치: `domains/[domain]/api/`

**API Hook**:
- 네이밍: `use[Domain][Action]Query` 또는 `use[Domain][Action]Mutation`
- 위치: `domains/[domain]/hooks/`

**Import 경로 규칙**:
- **모든 import는 절대경로(`@/`)를 사용**
- 도메인 내부 파일 간 참조도 절대경로 사용 (상대경로 금지)
- 예: `import { useAuth } from '@/domains/auth/hooks/useAuth'`
- 일관성 있는 경로 관리로 리팩토링 용이성 확보

**Compound Component ESLint 규칙**:
- 하위 컴포넌트는 별도 함수로 선언 후 할당
- `react/display-name` 에러 방지
- `react-hooks/rules-of-hooks` 에러 방지

```typescript
// ✅ 올바른 예시
const Trigger = ({ children }: { children: ReactNode }) => {
  const context = useContext(MyContext);
  return <button>{children}</button>;
};

MyComponent.Trigger = Trigger;

// ❌ 금지된 예시
MyComponent.Trigger = ({ children }) => {
  const context = useContext(MyContext); // ESLint 에러 발생
  return <button>{children}</button>;
};
```

**Controller (Page)**:
- 위치: `app/[route]/page.tsx`
- 네이밍: `[Feature]Page` (default export)

---

## 4. 안티 패턴 (Anti-Patterns) 🚫

### ❌ Anti-Pattern 1: Headless Hook에서 UI 반환
```typescript
// ❌ 금지
export const useRecord = () => {
  return <RecordCard />;
};
```

### ❌ Anti-Pattern 2: Compound Component에서 비즈니스 로직
```typescript
// ❌ 금지
Select.Option = ({ value }) => {
  const discountPrice = calculateDiscount(value.price); // 비즈니스 로직
  return <li>{discountPrice}</li>;
};
```

### ❌ Anti-Pattern 3: 단계 컴포넌트에서 다음 단계 이동
```typescript
// ❌ 금지
export default function Step1_Terms() {
  const router = useRouter();
  return <button onClick={() => router.push('/step2')}>다음</button>;
}
```

### ❌ Anti-Pattern 4: Controller에서 Api 직접 호출
```typescript
// ❌ 금지
export default function RecordPage() {
  const data = await recordApi.getRecordList();
}
```

### ❌ Anti-Pattern 5: 도메인 전용 Hook을 공통 폴더에 배치
```typescript
// ❌ 금지: hooks/useRecordCreate.ts (도메인 전용 로직)
// ✅ 올바름: domains/record/hooks/useRecordCreate.ts
```

### ❌ Anti-Pattern 6: Prop Drilling (5단계 이상)
```typescript
// ❌ 금지
<Parent data={data}>
  <Child1 data={data}>
    <Child2 data={data}>
      <Child3 data={data}>
        <Child4 data={data}>
          <Child5 data={data} /> {/* 너무 깊음 */}
        </Child4>
      </Child3>
    </Child2>
  </Child1>
</Parent>

// ✅ 해결: Context 또는 Compound Component 사용
```

### ❌ Anti-Pattern 7: UI 컴포넌트에서 직접 fetch
```typescript
// ❌ 금지
export default function RecordList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/records').then(res => res.json()).then(setData);
  }, []);

  return <ul>{data.map(...)}</ul>;
}

// ✅ 해결: useSuspenseQuery 사용
```

### ❌ Anti-Pattern 8: 컴포넌트 내부에서 로딩/에러 분기
```typescript
// ❌ 금지
function RecordList() {
  const { data, isLoading, isError } = useQuery(['records'], fetchRecords);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return <ul>{data.map(...)}</ul>;
}

// ✅ 해결: AsyncBoundary 사용
```

### ❌ Anti-Pattern 9: Context로 도메인 간 데이터 공유
```typescript
// ❌ 금지
// app/layout.tsx
const AppDataContext = createContext<{
  user: User;
  records: Record[];
} | null>(null);

export default function RootLayout({ children }: { children: ReactNode }) {
  const user = useUser();
  const records = useRecords();
  
  return (
    <AppDataContext.Provider value={{ user, records }}>
      {children}
    </AppDataContext.Provider>
  );
}

// ✅ 해결: Page 레벨에서 조립하거나 React Query로 서버 상태 공유
```

### ❌ Anti-Pattern 10: Props Drilling 회피를 위한 무분별한 Context 사용
```typescript
// ❌ 금지 (3단계 Props를 Context로 대체)
const UserContext = createContext<User | null>(null);

<UserContext.Provider value={user}>
  <RecordList>
    <RecordItem>
      <RecordAuthor /> {/* Context에서 user 가져옴 */}
    </RecordItem>
  </RecordList>
</UserContext.Provider>

// ✅ 해결: 3단계 Props는 그대로 유지 (명확하고 추적 가능)
<RecordList>
  <RecordItem userId={user.id}>
    <RecordAuthor userId={user.id} />
  </RecordItem>
</RecordList>
```

---

## 5. 코드 리뷰 기준

Pull Request 승인 전 다음 항목을 필수로 확인:

### 5.1 Headless Hook
- [ ] Headless Hook이 UI를 반환하지 않는가?
- [ ] 비즈니스 로직이 Hook에 집중되어 있는가?
- [ ] 파일이 올바른 위치에 배치되었는가?

### 5.2 Compound Component
- [ ] Compound Component가 비즈니스 로직을 포함하지 않는가?
- [ ] Context를 통해 상태를 공유하는가?
- [ ] Root Component에서만 Headless Hook을 호출하는가?

### 5.3 Funnel 패턴
- [ ] 각 단계 컴포넌트가 다음 단계 이동 로직을 포함하지 않는가?
- [ ] 상위 Controller에서 전체 플로우를 관리하는가?
- [ ] URL 기반 상태 관리를 사용하는가?

### 5.4 비동기 처리
- [ ] `useSuspenseQuery`를 사용하는가?
- [ ] `AsyncBoundary`로 로딩/에러 처리를 선언적으로 관리하는가?
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

### 6.1 Next.js 14 App Router
- **Server Component**: 기본적으로 Server Component 사용
- **Client Component**: 상태 관리가 필요한 경우 `'use client'` 선언
- **Route Groups**: 관련 라우트를 그룹화 (`(auth)`, `(product)`)
- **Loading UI**: `loading.tsx`로 Suspense Fallback 정의
- **Error UI**: `error.tsx`로 Error Boundary 정의

### 6.2 TanStack Query (React Query)
- **useSuspenseQuery**: 데이터 fetching 시 필수 사용
- **Query Key**: 배열 형태로 정의 (`['records', { filter }]`)
- **Mutation**: `useMutation`으로 데이터 변경 처리
- **Invalidation**: 성공 시 관련 Query 무효화

### 6.3 Zustand
- **전역 상태**: 도메인 간 공유가 필요한 상태만 사용
- **Store 분리**: 도메인별로 Store 분리 (`store/user.tsx`, `store/record.tsx`)
- **Selector**: 필요한 상태만 선택하여 사용

### 6.4 Headless UI
- **Compound Component**: Headless UI의 패턴을 참고
- **Accessibility**: WAI-ARIA 준수
- **Customization**: Tailwind CSS로 스타일링

### 6.5 Tailwind CSS
- **Utility-First**: 유틸리티 클래스 우선 사용
- **Custom Classes**: 반복되는 패턴은 `@apply`로 추상화
- **Responsive**: 모바일 우선 반응형 디자인

---

## 7. 참고 자료

- [Toss Frontend Architecture](https://toss.tech/article/frontend-architecture)
- [Headless UI Patterns](https://www.patterns.dev/posts/headless-ui)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Compound Component Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)

---

**마지막 업데이트**: 2025-12-17  
**버전**: 1.2.0
