---
inclusion: always
---

# 아키텍처 세부 규칙 (Architecture Rules)

이 문서는 Climingo 프로젝트의 세부 아키텍처 규칙을 정의합니다.

---

## Rule 1. Headless Hook의 책임

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

## Rule 2. Compound Component의 책임

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

## Rule 3. Funnel 패턴의 책임

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

## Rule 4. Api의 책임

**정의**: API 통신만 담당

**허용**:
- `fetch` 호출
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

## Rule 6. 선언적 비동기 처리

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

## Rule 7. 파일 네이밍 및 위치

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
