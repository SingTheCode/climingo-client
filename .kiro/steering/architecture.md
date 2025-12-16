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
│   └── [domain]/                 # 예: auth, record, profile, place
│       ├── components/           # UI 컴포넌트 (도메인 전용)
│       ├── hooks/                # Headless Hook (로직)
│       ├── api/                  # API 통신
│       │   ├── [domain]Api.ts
│       │   └── transform.ts      # Response → Entity 변환
│       └── types/                # 타입 정의
│           ├── entity.ts         # 도메인 엔티티
│           └── response.ts       # API 응답 타입
│
├── components/                   # 🧩 Shared UI Components (도메인 독립적)
│   ├── button/
│   ├── input/
│   └── popup/
│
├── hooks/                        # 🔧 Shared Hooks (도메인 독립적)
├── types/                        # 📦 Shared Types (공통 타입)
├── store/                        # 🗄️ Global State (Zustand)
├── api/                          # 🌐 API Client (Axios)
├── utils/                        # 🛠️ Utilities
└── lib/                          # ⚙️ External Library Config
```

**아키텍처 핵심**:
- **Controller (app/)**: 도메인을 조립하고 라우팅
- **Domain (domains/)**: 비즈니스 로직 격리, 도메인 간 직접 참조 금지
- **Shared (components/, hooks/, types/)**: 도메인 독립적인 공통 요소

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
- 공통 로직: `hooks/` (도메인 독립적)
- 도메인 로직: `domains/[domain]/hooks/use[UseCase].ts`

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

**위치**: `domains/[domain]/api/`

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

export const transformPlaceResponseToEntity = (response: PlaceResponse): Place => ({
  id: response.id,
  name: response.name ?? '장소 없음',
  level: response.level ?? 'V0',
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

**정의**: 서로 다른 도메인 간의 직접 참조를 지양하고, 상위 레벨에서 조립

#### 7.1 토스의 3단계 의사결정 트리

도메인 간 데이터가 필요할 때 다음 순서로 판단:

```
도메인 간 데이터 필요?
│
├─ 1단계: 구조 재설계 검토
│   └─ "정말 이 도메인이 다른 도메인을 알아야 하나?"
│   └─ 대부분 여기서 해결 (식별자만 전달)
│
├─ 2단계: 서버 상태 공유 (React Query)
│   └─ API가 필요한 데이터를 한 번에 반환
│   └─ 도메인 간 직접 참조 없이 해결
│
└─ 3단계: Page 레벨 조립
    └─ 페이지에서 여러 도메인 데이터를 fetch
    └─ 필요한 데이터만 Props로 전달
```

#### 7.2 허용/금지 사항

**허용**:
- 같은 도메인 내부의 파일 간 참조
- `components/common/`의 공통 컴포넌트 참조
- `types/common.ts`의 공통 타입 참조
- 상위 페이지에서 여러 도메인 조합

**금지**:
- `domains/record/`에서 `domains/profile/` 직접 import
- 도메인 전용 Hook을 다른 도메인에서 사용
- Context API로 도메인 간 데이터 공유

#### 7.3 실전 패턴

**패턴 1: 식별자만 전달 (가장 권장)**

```typescript
// ✅ Record 도메인은 userId만 알면 됨
// domains/record/components/RecordItem.tsx
interface RecordItemProps {
  recordId: string;
  userId: string; // User 객체가 아닌 식별자만
  title: string;
}

export function RecordItem({ recordId, userId, title }: RecordItemProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>작성자 ID: {userId}</p>
    </div>
  );
}
```

**패턴 2: 서버 상태 공유 (React Query)**

```typescript
// ✅ API가 필요한 데이터를 모두 반환
// domains/record/hooks/useRecordDetail.ts
export function useRecordDetail(recordId: string) {
  return useSuspenseQuery({
    queryKey: ['records', recordId],
    queryFn: async () => {
      const res = await recordApi.getRecordDetail(recordId);
      // API 응답에 이미 author 정보 포함
      return res; // { id, title, author: { id, name, profileImage } }
    }
  });
}

// domains/record/components/RecordDetail.tsx
export function RecordDetail({ recordId }: { recordId: string }) {
  const { data: record } = useRecordDetail(recordId);
  
  // Profile 도메인을 import 하지 않고도 작성자 정보 표시
  return (
    <div>
      <h1>{record.title}</h1>
      <p>작성자: {record.author.name}</p>
    </div>
  );
}
```

**패턴 3: Page 레벨 조립**

```typescript
// ✅ 페이지에서 두 도메인 데이터를 조합
// app/record/[recordId]/page.tsx
import { useRecordDetail } from '@/domains/record/hooks/useRecordDetail';
import { useUserProfile } from '@/domains/profile/hooks/useUserProfile';
import { RecordDetail } from '@/domains/record/components/RecordDetail';

export default function RecordDetailPage({ params }: { params: { recordId: string } }) {
  const { data: record } = useRecordDetail(params.recordId);
  const { data: author } = useUserProfile(record.authorId);

  // 필요한 데이터만 조립해서 전달
  return (
    <div>
      <RecordDetail 
        record={record}
        authorName={author.name}
        authorImage={author.profileImage}
      />
    </div>
  );
}

// domains/record/components/RecordDetail.tsx
interface RecordDetailProps {
  record: Record;
  authorName: string;
  authorImage: string;
}

export function RecordDetail({ record, authorName, authorImage }: RecordDetailProps) {
  // Profile 도메인과 직접 의존성 없음
  return (
    <div>
      <img src={authorImage} alt={authorName} />
      <h1>{record.title}</h1>
      <p>작성자: {authorName}</p>
    </div>
  );
}
```

#### 7.4 Props Drilling 판단 기준

**토스의 원칙**: "Props Drilling은 문제가 아니라 구조가 잘못된 신호"

| Props 깊이 | 판단 | 조치 |
|-----------|------|------|
| **2~3단계** | 정상 | 그대로 유지 (명확하고 추적 가능) |
| **4단계** | 주의 | 컴포넌트 구조 재검토 |
| **5단계 이상** | 문제 | 컴포넌트 분리 또는 Compound Component 패턴 적용 |

```typescript
// ✅ 3단계 Props는 괜찮음
<RecordList>
  <RecordItem userId={userId}>
    <RecordItemDetail userId={userId}>
      <RecordAuthor userId={userId} /> {/* 여기서 사용 */}
    </RecordItemDetail>
  </RecordItem>
</RecordList>

// ❌ 5단계 이상은 구조 재설계 필요
<A userId={userId}>
  <B userId={userId}>
    <C userId={userId}>
      <D userId={userId}>
        <E userId={userId}>
          <F userId={userId} /> {/* 너무 깊음 */}
        </E>
      </D>
    </C>
  </B>
</A>
```

#### 7.5 Context API 사용 기준

**중요**: Context는 도메인 간 데이터 공유가 아닌, **같은 도메인 내부의 UI 상태 관리**에만 사용

**✅ Context 사용이 적절한 경우**:
- 같은 도메인 내부의 UI 상태 (탭 선택, 펼침/접힘 등)
- Compound Component 패턴의 내부 상태
- 테마, 언어 설정 등 전역 UI 설정

**❌ Context 사용이 부적절한 경우**:
- 도메인 간 데이터 전달
- 비즈니스 로직 공유
- API 응답 데이터 공유 (React Query 사용)

```typescript
// ✅ 올바른 Context 사용 (같은 도메인 내부 UI 상태)
// domains/record/context/RecordPageContext.tsx
interface RecordPageContextValue {
  selectedTab: 'list' | 'map';
  setSelectedTab: (tab: 'list' | 'map') => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

const RecordPageContext = createContext<RecordPageContextValue | null>(null);

export function RecordPageProvider({ children }: { children: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <RecordPageContext.Provider value={{
      selectedTab,
      setSelectedTab,
      isFilterOpen,
      toggleFilter: () => setIsFilterOpen(prev => !prev)
    }}>
      {children}
    </RecordPageContext.Provider>
  );
}

// ❌ 잘못된 Context 사용 (도메인 간 데이터 공유)
// 절대 금지!
const AppDataContext = createContext<{
  user: User;
  records: Record[];
  places: Place[];
} | null>(null);
```

#### 7.6 금지된 패턴

```typescript
// ❌ 도메인 간 직접 참조
// domains/record/hooks/useRecordDetail.ts
import { useUserProfile } from '@/domains/profile/hooks/useUserProfile'; // 금지

export const useRecordDetail = () => {
  const user = useUserProfile(); // 도메인 간 직접 의존
};

// ❌ Context로 도메인 간 데이터 공유
// app/layout.tsx
const GlobalDataContext = createContext<{
  user: User;
  records: Record[];
} | null>(null);

export default function RootLayout({ children }: { children: ReactNode }) {
  const user = useUser();
  const records = useRecords();
  
  return (
    <GlobalDataContext.Provider value={{ user, records }}>
      {children}
    </GlobalDataContext.Provider>
  );
}
```

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

## 5. 마이그레이션 체크리스트

현재 프로젝트 상태 확인:

- [x] 도메인별 디렉토리 구조 (`domains/[domain]/`)
- [x] API 레이어 분리 (`domains/[domain]/api/`)
- [x] Transform 함수 분리 (`domains/[domain]/api/transform.ts`)
- [x] 타입 정의 분리 (`domains/[domain]/types/`)
- [x] 공통 컴포넌트 카테고리별 분류 (`components/button/`, `components/input/`, `components/popup/`)
- [x] `useSuspenseQuery` 사용
- [x] `AsyncBoundary` 패턴 적용

향후 개선 사항:
- [ ] Compound Component 패턴 적용 (필요 시)
- [ ] Funnel 패턴 적용 (다단계 플로우 시)

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

**마지막 업데이트**: 2025-12-16  
**버전**: 1.1.0
