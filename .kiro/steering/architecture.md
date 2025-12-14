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
├── app/                          # Next.js App Router (Controller)
│   ├── (auth)/                   # Route Group
│   │   ├── signIn/
│   │   │   └── page.tsx          # Controller: Headless Hook 호출
│   │   └── signUp/
│   │       ├── page.tsx          # Funnel Controller
│   │       └── steps/            # Funnel Step Components
│   │           ├── Step1_Terms.tsx
│   │           └── Step2_Info.tsx
│   ├── record/
│   │   ├── [recordId]/
│   │   │   └── page.tsx
│   │   └── create/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/                   # 공통 Headless + Compound UI
│   ├── common/                   # 범용 UI 컴포넌트
│   │   ├── Select/
│   │   │   ├── useSelect.ts      # Headless Hook
│   │   │   ├── Select.tsx        # Root + Context Provider
│   │   │   ├── SelectTrigger.tsx
│   │   │   └── SelectOption.tsx
│   │   ├── LayerPopup.tsx
│   │   └── NavigationHeader.tsx
│   ├── auth/                     # 인증 관련 공통 컴포넌트
│   ├── record/                   # 기록 관련 공통 컴포넌트
│   └── profile/                  # 프로필 관련 공통 컴포넌트
│
├── domains/                      # 도메인별 비즈니스 로직 (향후 마이그레이션 대상)
│   └── record/
│       ├── components/           # 도메인 전용 UI
│       ├── hooks/                # Headless Hook (비즈니스 로직)
│       │   └── useRecordCreate.ts
│       ├── api/                  # API 통신
│       │   └── recordApi.ts
│       └── types/                # Entity
│           └── record.ts
│
├── hooks/                        # 공통 Hooks (도메인 독립적)
│   ├── useIntersectionObserver.ts
│   ├── useAppScheme.ts
│   └── navigate.ts
│
├── api/                          # API 레이어
│   ├── axios.ts                  # Axios 인스턴스
│   ├── hooks/                    # React Query Hooks
│   │   ├── record.ts
│   │   └── user.ts
│   └── modules/                  # API 함수
│       ├── record.ts
│       └── user.ts
│
├── store/                        # 전역 상태 (Zustand)
│   └── user.tsx
│
├── types/                        # 공통 타입 정의
│   ├── record.ts
│   ├── auth.ts
│   └── common.ts
│
├── utils/                        # 유틸리티 함수
│   ├── eventEmitter.ts
│   └── common.ts
│
├── constants/                    # 상수
│   ├── level.ts
│   └── key.ts
│
└── lib/                          # 외부 라이브러리 설정 (향후 추가)
    └── funnel/
        └── useFunnel.ts
```

---

## 3. 세부 규칙 (Detailed Rules)

### Rule 1. Headless Hook의 책임

**정의**: UI와 완전히 분리된 로직과 상태 관리 Hook

**허용**:
- `useState`, `useEffect`, `useCallback`, `useMemo` 사용
- Api Hook 직접 호출
- 비즈니스 로직 처리
- 상태와 액션 함수 반환

**금지**:
- UI 컴포넌트 반환 (`return <Component />`)
- DOM 조작 (`document.querySelector` 등)
- 스타일 관련 로직

**위치**:
- 공통 로직: `components/[Component]/use[Component].ts`
- 도메인 로직: `domains/[domain]/hooks/use[UseCase].ts` (향후)
- 현재: `hooks/[domain]/use[Feature].ts`

**예시**:
```typescript
// ✅ 올바른 예시
export const useRecordCreate = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const createMutation = useCreateRecordMutation();

  const handleSubmit = useCallback(async () => {
    if (!selectedPlace || !videoFile) return;
    await createMutation.mutateAsync({ place: selectedPlace, video: videoFile });
  }, [selectedPlace, videoFile]);

  return {
    selectedPlace,
    setSelectedPlace,
    videoFile,
    setVideoFile,
    handleSubmit,
    isSubmitting: createMutation.isPending,
  };
};

// ❌ 금지된 예시
export const useRecordCreate = () => {
  return <RecordForm />; // UI 반환 금지
};
```

---

### Rule 2. Compound Component의 책임

**정의**: Context API를 활용해 상태를 공유하는 조립 가능한 컴포넌트

**구조**:
- **Root Component**: Context Provider 역할, Headless Hook 호출
- **하위 컴포넌트**: Context에서 필요한 상태/함수만 가져와 UI 렌더링

**허용**:
- Context에서 필요한 상태/함수만 가져옴
- UI 렌더링 및 이벤트 핸들링
- `children` prop을 통한 조합

**금지**:
- 비즈니스 로직 포함
- 직접 상태 관리 (Context 외)
- API 직접 호출

**위치**: `components/[Component]/`

**예시**:
```typescript
// ✅ 올바른 예시
// Select.tsx (Root)
const SelectContext = createContext<ReturnType<typeof useSelect> | null>(null);

export const Select = ({ children }: { children: ReactNode }) => {
  const select = useSelect();
  return (
    <SelectContext.Provider value={select}>
      {children}
    </SelectContext.Provider>
  );
};

// SelectTrigger.tsx
Select.Trigger = ({ children }: { children: ReactNode }) => {
  const { isOpen, toggle } = useContext(SelectContext)!;
  return <button onClick={toggle}>{children}</button>;
};

// SelectOption.tsx
Select.Option = ({ value, children }: { value: string; children: ReactNode }) => {
  const { selectOption } = useContext(SelectContext)!;
  return <li onClick={() => selectOption(value)}>{children}</li>;
};

// ❌ 금지된 예시
Select.Option = ({ value }) => {
  const discountPrice = calculateDiscount(value.price); // 비즈니스 로직 금지
  return <li>{discountPrice}</li>;
};
```

---

### Rule 3. Funnel 패턴의 책임

**정의**: 다단계 플로우를 상위 Controller에서 선언적으로 관리

**허용**:
- 전체 플로우 정의 (`steps` 배열)
- 단계 간 데이터 전달 (`onNext` 콜백)
- 최종 제출 로직 (`onFinish`)
- URL 기반 상태 관리 (Query Parameter)

**금지**:
- 각 단계 컴포넌트에서 다음 단계 이동 로직 포함
- 단계 컴포넌트에서 `useRouter` 직접 사용

**위치**:
- Controller: `app/[route]/page.tsx`
- 단계 컴포넌트: `app/[route]/steps/`
- Funnel Hook: `lib/funnel/useFunnel.ts` (향후 추가)

**예시**:
```typescript
// ✅ 올바른 예시 (Controller)
export default function SignUpPage() {
  const [formData, setFormData] = useState({});
  const { Funnel, Step, setStep } = useFunnel(['약관동의', '정보입력', '완료']);

  const handleTermsNext = (agreed: boolean) => {
    setFormData(prev => ({ ...prev, agreed }));
    setStep('정보입력');
  };

  const handleInfoNext = (info: UserInfo) => {
    setFormData(prev => ({ ...prev, ...info }));
    setStep('완료');
  };

  return (
    <Funnel>
      <Step name="약관동의">
        <TermsStep onNext={handleTermsNext} />
      </Step>
      <Step name="정보입력">
        <InfoStep onNext={handleInfoNext} />
      </Step>
      <Step name="완료">
        <CompleteStep data={formData} />
      </Step>
    </Funnel>
  );
}

// ❌ 금지된 예시 (Step Component)
export default function TermsStep() {
  const router = useRouter();
  return <button onClick={() => router.push('/signUp?step=2')}>다음</button>; // 금지
}
```

---

### Rule 4. Api의 책임

**정의**: API 통신만 담당

**허용**:
- `fetch`, `axios` 호출
- HTTP 요청/응답 처리
- Transform 함수 호출 (각 도메인 내부에서 Response → Entity 변환)

**금지**:
- 비즈니스 로직
- 상태 관리
- 변환 로직 직접 구현 (별도 Transform 함수로 분리)

**위치**:
- 현재: `api/modules/[domain].ts`
- 향후: `domains/[domain]/api/`

**예시**:
```typescript
// ✅ 올바른 예시
export const recordApi = {
  async getRecordList(params: RecordListParams) {
    const response = await apiClient.get<RecordResponse[]>('/records', { params });
    return response.data.map(transformRecordResponseToEntity);
  },
};

// domains/record/api/transform.ts
export const transformRecordResponseToEntity = (response: RecordResponse): Record => ({
  id: response.id,
  title: response.title ?? '제목 없음',
  description: response.description ?? '',
  videoUrl: response.video_url ?? '',
  createdAt: new Date(response.created_at),
  place: response.place ? transformPlaceResponseToEntity(response.place) : null,
});

// ❌ 금지된 예시
export const recordApi = {
  async getRecordList(params: RecordListParams) {
    const response = await apiClient.get('/records', { params });
    // 비즈니스 로직 금지
    const filtered = response.data.filter(r => r.isPublic);
    return filtered;
  },
};
```

---

### Rule 5. 레이어 간 의존성

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
```
Controller (Page)
    ↓
Headless Hook
    ↓
Api/API Hook
    ↓
API Module
```

---

### Rule 6. 선언적 비동기 처리

**정의**: `Suspense`와 `ErrorBoundary`를 조합하여 로딩/에러 처리를 선언적으로 관리

**허용**:
- `useSuspenseQuery` 사용 (TanStack Query)
- `AsyncBoundary` 패턴 사용
- 컴포넌트 내부에서 데이터가 무조건 존재한다고 가정

**금지**:
- `useQuery`의 `isLoading`, `isError` 분기 처리
- `useEffect` 내부에서 데이터 fetch 후 `useState`로 관리
- 컴포넌트 내부에서 `if (!data) return null;` 방어 코드

**예시**:
```typescript
// ✅ 올바른 예시
export default function RecordListPage() {
  return (
    <AsyncBoundary
      pendingFallback={<Loading />}
      rejectedFallback={<ErrorFallback />}
    >
      <RecordList />
    </AsyncBoundary>
  );
}

function RecordList() {
  const { data } = useSuspenseQuery({
    queryKey: ['records'],
    queryFn: recordApi.getRecordList,
  });

  // data는 무조건 존재한다고 가정
  return <ul>{data.map(record => <RecordItem key={record.id} {...record} />)}</ul>;
}

// ❌ 금지된 예시
function RecordList() {
  const { data, isLoading, isError } = useQuery(['records'], recordApi.getRecordList);

  if (isLoading) return <Loading />; // 금지
  if (isError) return <Error />; // 금지
  if (!data) return null; // 금지

  return <ul>{data.map(...)}</ul>;
}
```

---

### Rule 7. 도메인 격리 (Domain Isolation)

**정의**: 서로 다른 도메인 간의 직접 참조를 지양

**허용**:
- 같은 도메인 내부의 파일 간 참조
- `components/common/`의 공통 컴포넌트 참조
- 상위 페이지에서 여러 도메인 조합

**금지**:
- `domains/record/`에서 `domains/user/` 직접 참조
- 도메인 전용 Hook을 다른 도메인에서 사용

**예시**:
```typescript
// ✅ 올바른 예시 (Controller에서 조합)
export default function RecordDetailPage() {
  const record = useRecordDetail();
  const user = useUserProfile(record.userId);

  return (
    <>
      <RecordDetail record={record} />
      <UserProfile user={user} />
    </>
  );
}

// ❌ 금지된 예시
// domains/record/hooks/useRecordDetail.ts
import { useUserProfile } from '@/domains/user/hooks/useUserProfile'; // 금지

export const useRecordDetail = () => {
  const user = useUserProfile(); // 도메인 간 직접 참조 금지
};
```

---

### Rule 8. 파일 네이밍 및 위치

**Headless Hook**:
- 네이밍: `use[Domain][Action]` (예: `useRecordCreate`, `useUserProfile`)
- 위치: `hooks/[domain]/use[Feature].ts` (현재) → `domains/[domain]/hooks/` (향후)

**Compound Component**:
- Root: `[Component].tsx` (예: `Select.tsx`)
- 하위: `[Component][Part].tsx` (예: `SelectTrigger.tsx`, `SelectOption.tsx`)
- 위치: `components/[Component]/`

**Api**:
- 네이밍: `[domain]Api` (예: `recordApi`, `userApi`)
- 위치: `api/modules/[domain].ts` (현재) → `domains/[domain]/api/` (향후)

**API Hook**:
- 네이밍: `use[Domain][Action]Query` 또는 `use[Domain][Action]Mutation`
- 위치: `api/hooks/[domain].ts` (현재) → `domains/[domain]/hooks/` (향후)

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
// ❌ 금지: components/hooks/useRecordCreate.ts
// ✅ 올바름: domains/record/hooks/useRecordCreate.ts (향후)
// ✅ 현재: hooks/record/useRecordCreate.ts
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

---

## 5. 마이그레이션 체크리스트

현재 프로젝트를 Headless Compound 패턴으로 전환 시 확인 사항:

- [ ] `hooks/[domain]/` → `domains/[domain]/hooks/` 이동
- [ ] `api/modules/` → `domains/[domain]/api/` 이동
- [ ] `components/[domain]/` → `domains/[domain]/components/` 이동
- [ ] 공통 UI → Compound Component로 분리 (`components/common/`)
- [ ] 다단계 플로우 → Funnel 패턴 적용 (`lib/funnel/useFunnel.ts` 추가)
- [ ] `useQuery` → `useSuspenseQuery` 변환
- [ ] `AsyncBoundary` 패턴 적용
- [ ] Api에서 변환 로직 제거 (Transform 함수로 분리)
- [ ] Controller에서 Api 직접 호출 제거

---

## 6. 코드 리뷰 기준

Pull Request 승인 전 다음 항목을 필수로 확인:

### 6.1 Headless Hook
- [ ] Headless Hook이 UI를 반환하지 않는가?
- [ ] 비즈니스 로직이 Hook에 집중되어 있는가?
- [ ] 파일이 올바른 위치에 배치되었는가?

### 6.2 Compound Component
- [ ] Compound Component가 비즈니스 로직을 포함하지 않는가?
- [ ] Context를 통해 상태를 공유하는가?
- [ ] Root Component에서만 Headless Hook을 호출하는가?

### 6.3 Funnel 패턴
- [ ] 각 단계 컴포넌트가 다음 단계 이동 로직을 포함하지 않는가?
- [ ] 상위 Controller에서 전체 플로우를 관리하는가?
- [ ] URL 기반 상태 관리를 사용하는가?

### 6.4 비동기 처리
- [ ] `useSuspenseQuery`를 사용하는가?
- [ ] `AsyncBoundary`로 로딩/에러 처리를 선언적으로 관리하는가?
- [ ] 컴포넌트 내부에 `isLoading`, `isError` 분기가 없는가?

### 6.5 레이어 간 의존성
- [ ] Controller가 Api를 직접 호출하지 않는가?
- [ ] 도메인 간 직접 참조가 없는가?
- [ ] 파일이 올바른 위치에 배치되었는가?

### 6.6 네이밍 규칙
- [ ] 명명 규칙을 준수하는가?
- [ ] 파일명과 함수명이 일관성 있는가?

---

## 7. 기술 스택별 가이드

### 7.1 Next.js 14 App Router
- **Server Component**: 기본적으로 Server Component 사용
- **Client Component**: 상태 관리가 필요한 경우 `'use client'` 선언
- **Route Groups**: 관련 라우트를 그룹화 (`(auth)`, `(product)`)
- **Loading UI**: `loading.tsx`로 Suspense Fallback 정의
- **Error UI**: `error.tsx`로 Error Boundary 정의

### 7.2 TanStack Query (React Query)
- **useSuspenseQuery**: 데이터 fetching 시 필수 사용
- **Query Key**: 배열 형태로 정의 (`['records', { filter }]`)
- **Mutation**: `useMutation`으로 데이터 변경 처리
- **Invalidation**: 성공 시 관련 Query 무효화

### 7.3 Zustand
- **전역 상태**: 도메인 간 공유가 필요한 상태만 사용
- **Store 분리**: 도메인별로 Store 분리 (`store/user.tsx`, `store/record.tsx`)
- **Selector**: 필요한 상태만 선택하여 사용

### 7.4 Headless UI
- **Compound Component**: Headless UI의 패턴을 참고
- **Accessibility**: WAI-ARIA 준수
- **Customization**: Tailwind CSS로 스타일링

### 7.5 Tailwind CSS
- **Utility-First**: 유틸리티 클래스 우선 사용
- **Custom Classes**: 반복되는 패턴은 `@apply`로 추상화
- **Responsive**: 모바일 우선 반응형 디자인

---

## 8. 참고 자료

- [Toss Frontend Architecture](https://toss.tech/article/frontend-architecture)
- [Headless UI Patterns](https://www.patterns.dev/posts/headless-ui)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Compound Component Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)

---

**마지막 업데이트**: 2025-12-12  
**버전**: 1.0.0
