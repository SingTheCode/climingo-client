# 네이밍 컨벤션

이 문서는 헥사고날 아키텍처에서 사용할 파일명, 함수명, 변수명 등의 네이밍 규칙을 정의합니다.

## 파일명 규칙

### Controller (Components)
```
components/[feature]/[Feature내용].tsx
```

**예시**:
- `components/jjikbol/JjikbolShareDetail.tsx`
- `components/user/UserProfileEdit.tsx`
- `components/record/RecordList.tsx`
- `components/gym/GymSearchModal.tsx`

### Service (Hooks)
```
hooks/[feature]/use[Feature].ts
```

**예시**:
- `hooks/jjikbol/useJjikbol.ts`
- `hooks/user/useUser.ts`
- `hooks/record/useRecord.ts`
- `hooks/gym/useGym.ts`

### Repository (API Hooks)
```
api/hooks/[feature].ts
```

**예시**:
- `api/hooks/jjikbol.ts`
- `api/hooks/user.ts`
- `api/hooks/record.ts`
- `api/hooks/gym.ts`

### API Client (API Modules)
```
api/modules/[feature].ts
```

**예시**:
- `api/modules/jjikbol.ts`
- `api/modules/user.ts`
- `api/modules/record.ts`
- `api/modules/gym.ts`

### Domain Entity (Types)
```
types/[feature].ts
```

**예시**:
- `types/jjikbol.ts`
- `types/user.ts`
- `types/record.ts`
- `types/gym.ts`

## 함수명 규칙

### Repository (API Hooks)
**Query (조회)**:
```typescript
export const use[Get|Find|Search][Entity][Detail|List]Query = () => {}
```

**Mutation (변경)**:
```typescript
export const use[Create|Update|Delete][Entity]Mutation = () => {}
```

**예시**:
```typescript
// Query
export const useGetJjikbolDetailQuery = () => {}
export const useGetJjikbolListQuery = () => {}
export const useSearchJjikbolQuery = () => {}

// Mutation  
export const useCreateJjikbolMutation = () => {}
export const useUpdateJjikbolMutation = () => {}
export const useDeleteJjikbolMutation = () => {}
```

### API Client (API Modules)
```typescript
export const [get|create|update|delete][Entity][Detail|List]Api = () => {}
```

**예시**:
```typescript
export const getJjikbolDetailApi = () => {}
export const getJjikbolListApi = () => {}
export const createJjikbolApi = () => {}
export const updateJjikbolApi = () => {}
export const deleteJjikbolApi = () => {}
```

### Service (Hooks)
**Hook 명**:
```typescript
export const use[Entity] = () => {}
```

**메서드 명**:
```typescript
// CRUD 기본 동작
const create[Entity] = () => {}
const update[Entity] = () => {}
const delete[Entity] = () => {}
const get[Entity] = () => {}

// 비즈니스 로직 동작
const share[Entity] = () => {}
const save[Entity]AsImage = () => {}
const export[Entity] = () => {}
const validate[Entity] = () => {}
```

**예시**:
```typescript
export const useJjikbol = () => {
  return {
    // CRUD
    createJjikbol,
    updateJjikbol, 
    deleteJjikbol,
    getJjikbol,
    
    // 비즈니스 로직
    shareJjikbol,
    saveJjikbolAsImage,
    validateJjikbol,
    
    // 상태
    isLoading,
    error
  };
};
```

### Controller (Components)
**컴포넌트 명**:
```typescript
// 페이지 컴포넌트
[Feature][Action]Page
// 예: JjikbolCreatePage, UserProfilePage

// 상세 컴포넌트  
[Feature][Content][Type]
// 예: JjikbolShareDetail, UserProfileEdit

// 리스트 컴포넌트
[Feature]List
// 예: JjikbolList, RecordList

// 모달 컴포넌트
[Feature][Action]Modal
// 예: JjikbolCreateModal, UserDeleteModal
```

**이벤트 핸들러**:
```typescript
const handle[Action] = () => {}
const handle[Entity][Action] = () => {}
```

**예시**:
```typescript
const handleShare = () => {}
const handleSave = () => {}
const handleJjikbolShare = () => {}
const handleJjikbolSave = () => {}
```

## 변수명 규칙

### 상태 변수
```typescript
// 불린값
const [is[State], setIs[State]] = useState(false);
const [has[Something], setHas[Something]] = useState(false);

// 예시
const [isLoading, setIsLoading] = useState(false);
const [isVisible, setIsVisible] = useState(false);
const [hasPermission, setHasPermission] = useState(false);

// 객체/배열
const [entity, setEntity] = useState(null);
const [entityList, setEntityList] = useState([]);

// 예시  
const [jjikbol, setJjikbol] = useState(null);
const [jjikbolList, setJjikbolList] = useState([]);
```

### Props 인터페이스
```typescript
// 컴포넌트 Props
interface [Component]Props {
  // ...
}

// 예시
interface JjikbolShareDetailProps {
  jjikbolId: string;
  onShare?: () => void;
}

// 데이터 객체
interface [Entity]Data {
  // ...
}

// 예시
interface JjikbolData {
  id: string;
  title: string;
  // ...
}
```

### API Response/Request 타입
```typescript
// Response
export interface [Entity]Response {
  // 서버에서 받는 데이터 구조 (snake_case 등 그대로)
}

// Request  
export interface [Entity]Request {
  // 서버로 보내는 데이터 구조
}

// Domain Model (변환된 타입)
export interface [Entity] {
  // 클라이언트에서 사용하는 데이터 구조 (camelCase)
}
```

**예시**:
```typescript
// API Response (서버 형태 그대로)
export interface JjikbolResponse {
  jjikbol_id: string;
  problem_type: string;
  created_date: string;
}

// Domain Entity (클라이언트 형태)
export interface Jjikbol {
  id: string;
  problemType: string;
  createdDate: string;
}

// Request
export interface CreateJjikbolRequest {
  problem_type: string;
  description: string;
  gym_id: string;
}
```

## Model 변환 함수

```typescript
export const [Entity]Model = (serverData: [Entity]Response): [Entity] => {
  // 변환 로직
}
```

**예시**:
```typescript
export const JjikbolModel = (serverData: JjikbolResponse): Jjikbol => {
  return {
    id: serverData.jjikbol_id ?? "",
    problemType: serverData.problem_type ?? "",
    createdDate: serverData.created_date ?? "",
  };
};
```

## 상수명 규칙

```typescript
// 전역 상수 (대문자 + 언더스코어)
export const API_BASE_URL = 'https://api.example.com';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 컴포넌트 내 상수 (camelCase)
const defaultFormData = {
  title: '',
  description: ''
};

// Enum 대신 const assertion 사용
export const JJIKBOL_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',  
  DELETED: 'deleted'
} as const;

export type JjikbolStatus = typeof JJIKBOL_STATUS[keyof typeof JJIKBOL_STATUS];
```

## 핵심 원칙

1. **명확성**: 이름만 보고도 역할을 알 수 있어야 함
2. **일관성**: 동일한 패턴을 프로젝트 전체에 적용
3. **계층 구분**: 파일명과 함수명으로 계층을 구분 가능해야 함
4. **동사/명사 구분**: 함수는 동사로 시작, 변수는 명사 기반
5. **약어 지양**: 명확한 전체 단어 사용 권장