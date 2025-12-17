---
inclusion: always
---

# 도메인 격리 규칙 (Domain Isolation)

**정의**: 서로 다른 도메인 간의 직접 참조를 지양하고, 상위 레벨에서 조립

---

## 1. 3단계 의사결정 트리

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
- Context API로 도메인 간 데이터 공유

---

## 3. 실전 패턴

### 패턴 1: 식별자만 전달 (가장 권장)

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

### 패턴 2: 서버 상태 공유 (React Query)

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

### 패턴 3: Page 레벨 조립

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

---

## 4. Props Drilling 판단 기준

Props Drilling은 문제가 아니라 구조가 잘못된 신호

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

---

## 5. Context API 사용 기준

**중요**: Context는 도메인 간 데이터 공유가 아닌, **같은 도메인 내부의 UI 상태 관리**에만 사용

### Context 사용이 적절한 경우
- 같은 도메인 내부의 UI 상태 (탭 선택, 펼침/접힘 등)
- Compound Component 패턴의 내부 상태
- 테마, 언어 설정 등 전역 UI 설정

### Context 사용이 부적절한 경우
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

---

## 6. 도메인 간 의존성 해결

**원칙**: 1개의 도메인이 다른 1개의 도메인을 의존하면, 2개를 포괄하는 도메인을 생성

### 시나리오: auth와 profile이 서로 의존하는 경우

```typescript
// ❌ 금지된 패턴
// domains/auth/hooks/useAuth.ts
import { useProfile } from '@/domains/profile/hooks/useProfile'; // 도메인 간 의존

// domains/profile/hooks/useProfile.ts
import { useAuth } from '@/domains/auth/hooks/useAuth'; // 순환 의존
```

### 해결: 포괄 도메인 생성

```
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
```

### 통합 예시

```typescript
// domains/user/hooks/useUser.ts
export function useUser() {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: userApi.getCurrentUser,
  });

  return {
    user,
    isAuthenticated: !!user,
    profile: user?.profile,
  };
}

// app/profile/page.tsx
import { useUser } from '@/domains/user/hooks/useUser';

export default function ProfilePage() {
  const { user, profile } = useUser();
  
  return (
    <div>
      <h1>{profile.nickname}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 7. 금지된 패턴

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

## 8. 체크리스트

구현하면서 이것들을 확인하세요:

```typescript
// ✅ 이렇게 검사
// 1. 도메인 컴포넌트가 다른 도메인의 hooks를 import하나?
import { useAuth } from '@/domains/auth'; // ❌ 금지!

// 2. 도메인 타입이 공유 타입으로 정의되지 않았나?
export interface Record {
  user: User; // ← User는 types/에서만 import
}

// 3. Props가 5단계 이상 내려가나?
// ParentPage → Component1 → Component2 → Component3 → Component4
// 이 경우 컴포넌트 구조 재설계

// 4. 페이지에서 '조립'이 일어나나?
// export default function Page() {
//   const user = useAuth();
//   const records = useRecords(user.id);
//   return <RecordList records={records} currentUserId={user.id} />
// }
```
