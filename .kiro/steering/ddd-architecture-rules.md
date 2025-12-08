---
inclusion: always
---

# 도메인 주도 디렉토리 구조 규칙 (Domain-Driven Directory Structure Rules)

## 핵심 원칙 (Core Principles)

### 1. Collocation: 함께 수정되는 파일은 같은 위치에

**"기술적 분류가 아닌 기능적 분류"**

전통적인 프론트엔드 구조는 기술적 관심사로 파일을 분류합니다:
```
src/
├── components/     # 모든 컴포넌트
├── hooks/          # 모든 훅
├── utils/          # 모든 유틸리티
└── types/          # 모든 타입
```

**문제점**:
- 하나의 기능을 수정할 때 여러 폴더를 오가며 파일을 찾아야 함
- 관련 없는 코드들이 같은 폴더에 섞여 있음
- 도메인 경계가 불명확하여 의존성 관리 어려움
- 코드 재사용 시 어떤 파일까지 가져가야 하는지 불명확

**해결책: 도메인 중심 구조**
```
src/
├── shared/         # 전역 공통 요소
└── domains/        # 비즈니스 로직 집합
    ├── record/     # 기록 도메인
    ├── auth/       # 인증 도메인
    └── jjikboul/   # 찜불 도메인
```

**장점**:
- 관련 파일들이 물리적으로 가까이 위치
- 도메인 단위로 코드 이해 및 수정 가능
- 명확한 경계로 의존성 관리 용이
- 도메인 단위 코드 재사용 및 삭제 간편

### 2. 도메인 격리 (Domain Isolation)

각 도메인은 **독립적인 비즈니스 단위**입니다. 서로 다른 도메인 간 직접 참조를 금지하여 결합도를 낮춥니다.

**핵심 규칙**:
- ✅ 같은 도메인 내부 파일 간 자유로운 참조
- ✅ `shared` 폴더의 공통 요소 참조
- ❌ 다른 도메인 파일 직접 참조 금지

**잘못된 예**:
```typescript
// ❌ domains/record/components/RecordItem.tsx
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';
```

**올바른 예**:
```typescript
// ✅ app/record/page.tsx (상위 레이어에서 조합)
import { RecordItem } from '@/domains/record/components/RecordItem';
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';

export default function RecordPage() {
  const { mutate: toggleJjikboul } = useJjikboulMutation();
  
  return <RecordItem onJjikboul={toggleJjikboul} />;
}
```

## 표준 디렉토리 구조 (Directory Structure)

### 전체 구조

```
src/
├── app/                    # Next.js App Router (페이지 라우팅)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── record/
│   │   ├── page.tsx
│   │   └── [recordId]/
│   │       └── page.tsx
│   └── ...
│
├── shared/                 # 전역 공통 요소 (비즈니스 로직 제거)
│   ├── components/         # 범용 UI 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── hooks/              # 범용 훅
│   │   ├── useIntersectionObserver.ts
│   │   └── useDebounce.ts
│   ├── utils/              # 순수 함수 유틸리티
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── constants/          # 전역 상수
│   │   └── config.ts
│   └── types/              # 전역 타입 정의
│       └── common.ts
│
└── domains/                # 비즈니스 도메인 집합
    ├── record/             # 기록 도메인
    │   ├── components/     # 기록 전용 컴포넌트
    │   │   ├── RecordItem.tsx
    │   │   ├── RecordList.tsx
    │   │   └── CreateRecordForm.tsx
    │   ├── hooks/          # 기록 전용 훅
    │   │   ├── useRecordListQuery.ts
    │   │   └── useDeleteRecordMutation.ts
    │   ├── api/            # 기록 API 통신
    │   │   └── record.ts
    │   ├── types/          # 기록 타입 정의
    │   │   └── record.ts
    │   └── utils/          # 기록 전용 유틸리티 (선택)
    │       └── recordFormatter.ts
    │
    ├── auth/               # 인증 도메인
    │   ├── components/
    │   ├── hooks/
    │   ├── api/
    │   └── types/
    │
    └── jjikboul/           # 찜불 도메인
        ├── components/
        ├── hooks/
        ├── api/
        └── types/
```

### 도메인 내부 구조 규칙

각 도메인은 다음 하위 폴더를 가질 수 있습니다:

| 폴더 | 역할 | 필수 여부 |
|------|------|-----------|
| `components/` | 도메인 전용 UI 컴포넌트 | 필수 |
| `hooks/` | 도메인 전용 React 훅 (데이터 페칭, 상태 관리) | 필수 |
| `api/` | 도메인 API 통신 로직 | 필수 |
| `types/` | 도메인 타입 정의 | 필수 |
| `utils/` | 도메인 전용 유틸리티 함수 | 선택 |
| `constants/` | 도메인 전용 상수 | 선택 |
| `store/` | 도메인 전역 상태 (Zustand 등) | 선택 |

## 세부 규칙 (Detailed Rules)

### Rule 1. Shared vs Domains

#### Shared 폴더에 들어갈 수 있는 코드

**기준**: 비즈니스 로직이 없고, 여러 도메인에서 재사용 가능한 순수한 기술적 요소

**허용**:
- ✅ 범용 UI 컴포넌트 (Button, Input, Modal 등)
- ✅ 범용 React 훅 (useDebounce, useIntersectionObserver 등)
- ✅ 순수 함수 유틸리티 (날짜 포맷, 문자열 변환 등)
- ✅ 전역 상수 (API URL, 환경 변수 등)
- ✅ 전역 타입 (공통 응답 형식, 에러 타입 등)

**금지**:
- ❌ 특정 도메인에 종속된 컴포넌트
- ❌ 특정 API 엔드포인트 호출 로직
- ❌ 비즈니스 규칙이 포함된 함수
- ❌ 도메인 엔티티 타입

**예시**:

```typescript
// ✅ shared/components/Button/Button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ✅ shared/utils/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR');
}

// ❌ shared/components/RecordItem.tsx (도메인 종속)
// 이것은 domains/record/components/RecordItem.tsx에 위치해야 함

// ❌ shared/hooks/useRecordList.ts (도메인 종속)
// 이것은 domains/record/hooks/useRecordListQuery.ts에 위치해야 함
```

#### Domains 폴더에 들어가야 하는 코드

**기준**: 특정 비즈니스 도메인에 종속된 모든 코드

**포함**:
- ✅ 도메인 전용 컴포넌트
- ✅ 도메인 API 호출 로직
- ✅ 도메인 데이터 페칭 훅
- ✅ 도메인 엔티티 타입
- ✅ 도메인 비즈니스 로직

**예시**:

```typescript
// ✅ domains/record/types/record.ts
export interface Record {
  id: string;
  userId: string;
  placeId: string;
  videoUrl: string;
  level: number;
}

// ✅ domains/record/api/record.ts
export async function fetchRecordList(params: RecordListParams) {
  return axios.get('/api/records', { params });
}

// ✅ domains/record/hooks/useRecordListQuery.ts
export function useRecordListQuery(params: RecordListParams) {
  return useQuery({
    queryKey: ['records', params],
    queryFn: () => fetchRecordList(params),
  });
}

// ✅ domains/record/components/RecordItem.tsx
export function RecordItem({ record }: { record: Record }) {
  return <div>{record.videoUrl}</div>;
}
```

### Rule 2. 도메인 격리 (Domain Isolation)

#### 의존성 방향 규칙

```
app/ (페이지)
  ↓ 참조 가능
domains/ (도메인)
  ↓ 참조 가능
shared/ (공통)
```

**허용되는 의존성**:
- ✅ `app/` → `domains/`
- ✅ `app/` → `shared/`
- ✅ `domains/` → `shared/`
- ✅ `domains/record/` 내부 파일 간 참조

**금지되는 의존성**:
- ❌ `domains/record/` → `domains/auth/`
- ❌ `domains/jjikboul/` → `domains/record/`
- ❌ `shared/` → `domains/`
- ❌ `shared/` → `app/`

#### 도메인 간 협업이 필요한 경우

**문제 상황**: 기록(record) 컴포넌트에서 찜불(jjikboul) 기능이 필요한 경우

**❌ 잘못된 해결책**:
```typescript
// domains/record/components/RecordItem.tsx
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';

export function RecordItem({ record }: RecordItemProps) {
  const { mutate } = useJjikboulMutation(); // ❌ 도메인 간 직접 참조
  
  return (
    <div>
      <button onClick={() => mutate(record.id)}>찜불</button>
    </div>
  );
}
```

**✅ 올바른 해결책 1: Props로 전달**
```typescript
// domains/record/components/RecordItem.tsx
export function RecordItem({ 
  record, 
  onJjikboul 
}: RecordItemProps) {
  return (
    <div>
      <button onClick={() => onJjikboul(record.id)}>찜불</button>
    </div>
  );
}

// app/record/page.tsx (상위 레이어에서 조합)
import { RecordItem } from '@/domains/record/components/RecordItem';
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';

export default function RecordPage() {
  const { mutate: toggleJjikboul } = useJjikboulMutation();
  
  return <RecordItem record={record} onJjikboul={toggleJjikboul} />;
}
```

**✅ 올바른 해결책 2: Shared 레이어로 추상화**
```typescript
// shared/hooks/useJjikboul.ts (공통 인터페이스만 제공)
export interface JjikboulActions {
  toggle: (id: string) => void;
  isJjikboul: (id: string) => boolean;
}

// domains/jjikboul/hooks/useJjikboulActions.ts
export function useJjikboulActions(): JjikboulActions {
  const { mutate } = useJjikboulMutation();
  return {
    toggle: mutate,
    isJjikboul: (id) => { /* ... */ }
  };
}

// app/record/page.tsx
import { RecordItem } from '@/domains/record/components/RecordItem';
import { useJjikboulActions } from '@/domains/jjikboul/hooks/useJjikboulActions';

export default function RecordPage() {
  const jjikboulActions = useJjikboulActions();
  
  return <RecordItem record={record} jjikboulActions={jjikboulActions} />;
}
```

### Rule 3. 파일 네이밍 및 위치

#### API 파일

**위치**: `domains/[domain]/api/`

**네이밍**: `[domain].ts` 또는 `[feature].ts`

```typescript
// ✅ domains/record/api/record.ts
export async function fetchRecordList() { /* ... */ }
export async function createRecord() { /* ... */ }
export async function deleteRecord() { /* ... */ }

// ✅ domains/auth/api/auth.ts
export async function login() { /* ... */ }
export async function logout() { /* ... */ }
```

**❌ 금지**: `src/api/record.ts` (도메인 외부에 API 파일 위치)

#### 타입 파일

**위치**: `domains/[domain]/types/`

**네이밍**: `[entity].ts`

```typescript
// ✅ domains/record/types/record.ts
export interface Record { /* ... */ }
export interface RecordListParams { /* ... */ }
export interface CreateRecordRequest { /* ... */ }

// ✅ domains/auth/types/user.ts
export interface User { /* ... */ }
export interface LoginRequest { /* ... */ }
```

**❌ 금지**: `src/types/record.ts` (도메인 외부에 타입 파일 위치)

#### 훅 파일

**위치**: `domains/[domain]/hooks/`

**네이밍**: `use[Feature][Type].ts`
- Query: 데이터 조회
- Mutation: 데이터 변경
- 일반 훅: 비즈니스 로직

```typescript
// ✅ domains/record/hooks/useRecordListQuery.ts
export function useRecordListQuery() { /* ... */ }

// ✅ domains/record/hooks/useDeleteRecordMutation.ts
export function useDeleteRecordMutation() { /* ... */ }

// ✅ domains/record/hooks/useRecordFilter.ts
export function useRecordFilter() { /* ... */ }
```

**❌ 금지**: `src/hooks/useRecordList.ts` (도메인 외부에 훅 파일 위치)

#### 컴포넌트 파일

**위치**: `domains/[domain]/components/`

**네이밍**: `[ComponentName].tsx`

**구조 옵션**:

1. **단일 파일** (간단한 컴포넌트):
```
domains/record/components/
├── RecordItem.tsx
├── RecordList.tsx
└── CreateRecordForm.tsx
```

2. **폴더 구조** (복잡한 컴포넌트):
```
domains/record/components/
└── RecordItem/
    ├── RecordItem.tsx
    ├── RecordItemHeader.tsx
    ├── RecordItemActions.tsx
    ├── useRecordItem.ts
    └── index.ts
```

**❌ 금지**: `src/components/RecordItem.tsx` (도메인 외부에 도메인 컴포넌트 위치)

#### 유틸리티 파일

**위치**: 
- 도메인 전용: `domains/[domain]/utils/`
- 전역 공통: `shared/utils/`

**네이밍**: `[purpose].ts`

```typescript
// ✅ domains/record/utils/recordFormatter.ts (도메인 전용)
export function formatRecordDate(record: Record) { /* ... */ }

// ✅ shared/utils/format.ts (전역 공통)
export function formatDate(date: Date) { /* ... */ }
```

**판단 기준**:
- 특정 도메인 타입에 의존 → `domains/[domain]/utils/`
- 순수 함수, 범용 → `shared/utils/`

## 안티 패턴 (Anti-Patterns)

### ❌ Anti-Pattern 1: 도메인 전용 코드를 Shared에 배치

```typescript
// ❌ shared/hooks/useRecordList.ts
export function useRecordList() {
  return useQuery({
    queryKey: ['records'],
    queryFn: fetchRecordList, // Record 도메인에 종속
  });
}
```

**문제점**:
- Record 도메인에 종속된 훅이 shared에 위치
- 다른 도메인에서 재사용 불가능
- 도메인 경계 모호

**해결책**:
```typescript
// ✅ domains/record/hooks/useRecordListQuery.ts
export function useRecordListQuery() {
  return useQuery({
    queryKey: ['records'],
    queryFn: fetchRecordList,
  });
}
```

### ❌ Anti-Pattern 2: 도메인 간 직접 참조

```typescript
// ❌ domains/record/components/RecordItem.tsx
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';

export function RecordItem({ record }: RecordItemProps) {
  const { mutate } = useJjikboulMutation(); // 다른 도메인 직접 참조
  // ...
}
```

**문제점**:
- 도메인 간 강한 결합
- 순환 참조 위험
- 도메인 독립성 상실

**해결책**:
```typescript
// ✅ domains/record/components/RecordItem.tsx
export function RecordItem({ 
  record, 
  onJjikboul 
}: RecordItemProps) {
  // Props로 전달받아 사용
}

// app/record/page.tsx
import { RecordItem } from '@/domains/record/components/RecordItem';
import { useJjikboulMutation } from '@/domains/jjikboul/hooks/useJjikboul';

export default function RecordPage() {
  const { mutate } = useJjikboulMutation();
  return <RecordItem record={record} onJjikboul={mutate} />;
}
```

### ❌ Anti-Pattern 3: 기술적 분류로 폴더 구조화

```
src/
├── components/
│   ├── RecordItem.tsx      # Record 도메인
│   ├── AuthForm.tsx        # Auth 도메인
│   └── JjikboulButton.tsx  # Jjikboul 도메인
├── hooks/
│   ├── useRecordList.ts
│   ├── useAuth.ts
│   └── useJjikboul.ts
└── api/
    ├── record.ts
    ├── auth.ts
    └── jjikboul.ts
```

**문제점**:
- 관련 파일들이 물리적으로 분리
- 도메인 경계 불명확
- 코드 수정 시 여러 폴더 탐색 필요

**해결책**:
```
src/
└── domains/
    ├── record/
    │   ├── components/RecordItem.tsx
    │   ├── hooks/useRecordListQuery.ts
    │   └── api/record.ts
    ├── auth/
    │   ├── components/AuthForm.tsx
    │   ├── hooks/useAuth.ts
    │   └── api/auth.ts
    └── jjikboul/
        ├── components/JjikboulButton.tsx
        ├── hooks/useJjikboul.ts
        └── api/jjikboul.ts
```

### ❌ Anti-Pattern 4: 거대한 Shared 폴더

```typescript
// ❌ shared/components/RecordFilterSection.tsx
// Record 도메인에만 사용되는 컴포넌트를 shared에 배치

// ❌ shared/utils/recordValidator.ts
// Record 도메인 전용 검증 로직을 shared에 배치

// ❌ shared/hooks/useRecordFilter.ts
// Record 도메인 전용 훅을 shared에 배치
```

**문제점**:
- Shared가 비대해짐
- 실제로는 한 도메인에서만 사용
- 재사용성 착각

**해결책**:
```typescript
// ✅ domains/record/components/FilterSection.tsx
// ✅ domains/record/utils/recordValidator.ts
// ✅ domains/record/hooks/useRecordFilter.ts
```

**Shared 배치 기준**:
- 2개 이상의 도메인에서 실제로 사용 중
- 비즈니스 로직이 없는 순수 기술적 요소
- 도메인 타입에 의존하지 않음

### ❌ Anti-Pattern 5: Page 컴포넌트에 비즈니스 로직 포함

```typescript
// ❌ app/record/page.tsx
export default function RecordPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/records')
      .then(res => res.json())
      .then(data => setRecords(data))
      .finally(() => setLoading(false));
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

**문제점**:
- 페이지에 데이터 페칭 로직 직접 작성
- 재사용 불가능
- 테스트 어려움

**해결책**:
```typescript
// ✅ domains/record/hooks/useRecordListQuery.ts
export function useRecordListQuery() {
  return useQuery({
    queryKey: ['records'],
    queryFn: fetchRecordList,
  });
}

// ✅ app/record/page.tsx
import { useRecordListQuery } from '@/domains/record/hooks/useRecordListQuery';
import { RecordList } from '@/domains/record/components/RecordList';

export default function RecordPage() {
  const { data: records, isLoading } = useRecordListQuery();
  
  return <RecordList records={records} isLoading={isLoading} />;
}
```

## 마이그레이션 가이드

### 현재 프로젝트 구조 개선 방향

**현재 상태**:
```
src/
├── components/         # 공통 컴포넌트와 도메인 컴포넌트 혼재
├── hooks/              # 공통 훅과 도메인 훅 혼재
├── api/                # 모든 API 로직
├── utils/              # 모든 유틸리티
├── types/              # 모든 타입
└── domains/            # 일부 도메인만 분리
    ├── record/
    ├── auth/
    └── jjikboul/
```

**개선 목표**:
```
src/
├── app/                # Next.js App Router
├── shared/             # 진짜 공통 요소만
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── domains/            # 모든 도메인 로직
    ├── record/
    ├── auth/
    └── jjikboul/
```

### 마이그레이션 단계

#### 1단계: 도메인 식별
- 현재 `src/components`, `src/hooks`, `src/api`에서 도메인별로 파일 그룹화
- 각 파일이 어떤 도메인에 속하는지 분류

#### 2단계: 도메인별 이동
```bash
# Record 도메인 예시
src/components/RecordItem.tsx → src/domains/record/components/RecordItem.tsx
src/hooks/useRecordList.ts → src/domains/record/hooks/useRecordListQuery.ts
src/api/record.ts → src/domains/record/api/record.ts
src/types/record.ts → src/domains/record/types/record.ts
```

#### 3단계: Shared 정리
- 진짜 공통 요소만 `shared/`에 남김
- 도메인 종속 코드는 해당 도메인으로 이동

#### 4단계: Import 경로 수정
```typescript
// Before
import { RecordItem } from '@/components/RecordItem';

// After
import { RecordItem } from '@/domains/record/components/RecordItem';
```

#### 5단계: 도메인 간 의존성 제거
- 도메인 간 직접 참조 찾아서 제거
- Props 전달 또는 Shared 추상화로 변경

## 체크리스트

### 새 기능 개발 시
- [ ] 어떤 도메인에 속하는가?
- [ ] 해당 도메인 폴더 내에 파일 생성했는가?
- [ ] 다른 도메인을 직접 참조하지 않는가?
- [ ] Shared에 배치할 필요가 있는가? (2개 이상 도메인에서 사용?)

### 코드 리뷰 시
- [ ] 파일이 올바른 도메인 폴더에 위치하는가?
- [ ] 도메인 간 직접 참조가 없는가?
- [ ] Shared에 도메인 종속 코드가 없는가?
- [ ] 도메인 격리 원칙을 준수하는가?

### 리팩토링 시
- [ ] 도메인 경계가 명확한가?
- [ ] 관련 파일들이 같은 위치에 있는가?
- [ ] 불필요한 의존성이 제거되었는가?
- [ ] Shared 폴더가 비대하지 않은가?
