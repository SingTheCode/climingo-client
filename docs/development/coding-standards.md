# 코딩 표준

이 문서는 Climingo 프로젝트의 코딩 표준과 규칙을 정의합니다.

## TypeScript 규칙

### 타입 정의
```typescript
// ✅ 인터페이스는 PascalCase 사용
interface UserProfile {
  id: string;
  nickname: string;
  profileUrl?: string;
}

// ✅ 타입 별칭도 PascalCase 사용  
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
}

// ✅ enum 대신 const assertion 사용
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
```

### 함수 정의
```typescript
// ✅ 함수는 camelCase, 명확한 반환 타입 정의
const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // 구현
}

// ✅ 복잡한 함수는 JSDoc 주석 추가
/**
 * 사용자 프로필을 업데이트합니다
 * @param userId - 사용자 ID
 * @param profileData - 업데이트할 프로필 데이터
 * @returns 업데이트된 프로필 정보
 */
const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  // 구현
}
```

### null/undefined 처리
```typescript
// ✅ Optional chaining 사용
const userName = user?.profile?.nickname ?? '익명';

// ✅ Nullish coalescing 사용
const displayName = user.nickname ?? user.email ?? '사용자';

// ❌ 피해야 할 패턴
const userName = user && user.profile && user.profile.nickname || '익명';
```

## React 컴포넌트 규칙

### 컴포넌트 구조
```typescript
// ✅ 올바른 컴포넌트 구조
interface ComponentProps {
  title: string;
  onSubmit?: () => void;
}

export default function Component({ title, onSubmit }: ComponentProps) {
  // 1. 상태 정의
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. 커스텀 훅 사용
  const { user } = useUser();
  
  // 3. 이벤트 핸들러 정의
  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    onSubmit?.();
  }, [onSubmit]);
  
  // 4. 조건부 렌더링
  if (isLoading) return <Loading />;
  
  // 5. JSX 반환
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
}
```

### 이벤트 핸들러
```typescript
// ✅ handle 접두사 사용
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = (value: string) => {};

// ✅ 타입 안전한 이벤트 핸들러
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  // 처리 로직
};
```

### 상태 관리
```typescript
// ✅ useState는 구체적인 타입 정의
const [user, setUser] = useState<UserProfile | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [errors, setErrors] = useState<Record<string, string>>({});

// ✅ 복잡한 상태는 useReducer 고려
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  // 상태 업데이트 로직
};
```

## 스타일링 규칙

### Tailwind CSS
```typescript
// ✅ 클래스명 정렬 순서: 레이아웃 → 스타일 → 상호작용
<div className="flex items-center justify-center w-full h-screen bg-white text-black hover:bg-gray-100" />

// ✅ 조건부 클래스명
<button 
  className={`
    px-4 py-2 rounded-lg font-medium
    ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
  `}
/>
```

## 에러 처리

### API 호출 에러 처리
```typescript
// ✅ 구체적인 에러 타입 정의
interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// ✅ try-catch와 타입 가드 사용
const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await getUserApi(userId);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API 에러:', error.message);
      // 에러 처리 로직
    }
    return null;
  }
};
```

### React 에러 경계
```typescript
// ✅ 에러 경계 컴포넌트 사용
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('에러 경계에서 캐치된 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>오류가 발생했습니다.</div>;
    }

    return this.props.children;
  }
}
```

## 성능 최적화

### React.memo 사용
```typescript
// ✅ 불필요한 리렌더링 방지
interface ItemProps {
  item: Item;
  onSelect: (id: string) => void;
}

const Item = React.memo(({ item, onSelect }: ItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  return <div onClick={handleClick}>{item.title}</div>;
});
```

### useMemo와 useCallback
```typescript
// ✅ 비용이 큰 계산은 useMemo로 메모화
const expensiveValue = useMemo(() => {
  return items.filter(item => item.isActive).length;
}, [items]);

// ✅ 함수는 useCallback으로 메모화
const handleSubmit = useCallback(async (data: FormData) => {
  await submitData(data);
}, [submitData]);
```

## 주석 및 문서화

### JSDoc 주석
```typescript
/**
 * 사용자 인증을 처리하는 커스텀 훅
 * @returns 인증 관련 상태와 함수들
 * @example
 * ```typescript
 * const { user, login, logout, isLoading } = useAuth();
 * ```
 */
export const useAuth = () => {
  // 구현
};
```

### 인라인 주석
```typescript
// 비즈니스 로직이 복잡한 경우에만 주석 추가
const calculateTotalScore = (records: Record[]) => {
  // 최근 30일 내의 기록만 점수 계산에 포함
  const recentRecords = records.filter(record => 
    isWithinDays(record.createdAt, 30)
  );
  
  // 난이도별 가중치 적용
  return recentRecords.reduce((total, record) => {
    const weight = DIFFICULTY_WEIGHTS[record.level];
    return total + (record.score * weight);
  }, 0);
};
```

## 금지 사항

### 사용하지 않을 패턴
```typescript
// ❌ any 타입 사용 금지
const data: any = fetchData();

// ❌ 비어있는 catch 블록
try {
  // 코드
} catch (e) {
  // 아무것도 하지 않음
}

// ❌ console.log를 프로덕션 코드에 남기지 않기
console.log('디버깅용 로그');

// ❌ 인라인 스타일 사용 금지 (특별한 경우 제외)
<div style={{ color: 'red' }} />

// ❌ 하드코딩된 값 사용 금지
if (user.role === 'admin') {} // 상수로 정의해서 사용
```

### 코드 리뷰에서 확인할 사항
1. **타입 안전성**: 모든 변수와 함수에 적절한 타입이 지정되어 있는가?
2. **명명 규칙**: 변수, 함수, 컴포넌트명이 규칙을 따르는가?
3. **성능**: 불필요한 리렌더링이나 계산이 없는가?
4. **접근성**: 스크린 리더와 키보드 내비게이션을 고려했는가?
5. **에러 처리**: 예외 상황이 적절히 처리되었는가?
6. **테스트**: 핵심 로직에 대한 테스트가 작성되었는가?