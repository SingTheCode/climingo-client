# Climingo Frontend Architecture

> **최종 업데이트**: 2025-12-16  
> **아키텍처 패턴**: Headless Compound Pattern + Domain-Driven Design

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router (Controller)
│   ├── (auth)/                   # 인증 관련 페이지
│   ├── record/                   # 기록 관련 페이지
│   ├── myProfile/                # 프로필 관련 페이지
│   └── jjikboul/                 # 찜볼 관련 페이지
│
├── domains/                      # 도메인별 비즈니스 로직
│   ├── auth/                     # 인증 도메인
│   │   ├── api/                  # API 통신 (Repository)
│   │   ├── components/           # 도메인 전용 UI
│   │   ├── hooks/                # Headless Hook (비즈니스 로직)
│   │   └── types/                # Entity & Response 타입
│   ├── record/                   # 기록 도메인
│   ├── profile/                  # 프로필 도메인
│   ├── jjikboul/                 # 찜볼 도메인
│   └── place/                    # 장소 도메인
│       ├── api/
│       ├── components/
│       ├── constants/            # 도메인 상수
│       ├── hooks/
│       └── types/
│
├── components/                   # 공통 UI 컴포넌트
│   └── common/                   # 범용 컴포넌트
│       ├── Input/                # Compound Component
│       ├── LayerPopup/           # Compound Component
│       ├── NavigationHeader.tsx
│       ├── Avatar.tsx
│       ├── Loading.tsx
│       └── ...
│
├── hooks/                        # 공통 Hooks (도메인 독립적)
│   ├── common.ts                 # useDebounce, useDidMountEffect, useRunOnce
│   ├── useIntersectionObserver.ts
│   └── getQueryClient.ts
│
├── lib/                          # 공통 라이브러리
│   └── async/                    # AsyncBoundary
│
├── store/                        # 전역 상태 (Zustand)
│   └── user.tsx
│
├── types/                        # 공통 타입 정의
│   ├── common.ts                 # Pagination
│   └── appScheme.ts              # 앱 스킴 관련
│
├── utils/                        # 유틸리티 함수
│   └── common.ts
│
└── api/                          # API 설정
    └── axios.ts
```

## 🏗️ 아키텍처 레이어

### 1. Controller Layer (Page)
- **위치**: `app/`
- **역할**: Headless Hook 호출, UI 조합
- **규칙**: 
  - 비즈니스 로직 포함 금지
  - API 직접 호출 금지
  - AsyncBoundary로 로딩/에러 처리

### 2. Headless Hook Layer
- **위치**: `domains/[domain]/hooks/`
- **역할**: 비즈니스 로직, 상태 관리
- **규칙**:
  - UI 반환 금지
  - API Hook 호출
  - 순수 로직만 담당

### 3. Repository Layer (API)
- **위치**: `domains/[domain]/api/`
- **역할**: API 통신, Transform 함수 호출
- **규칙**:
  - HTTP 요청/응답만 처리
  - Response → Entity 변환
  - 비즈니스 로직 금지

### 4. Transform Layer
- **위치**: `domains/[domain]/api/transform.ts`
- **역할**: DTO → Entity 변환
- **규칙**:
  - 옵셔널 체이닝 + Nullish Coalescing 사용
  - 완전한 Entity 객체 반환

### 5. Component Layer
- **위치**: `components/common/`, `domains/[domain]/components/`
- **역할**: UI 렌더링
- **규칙**:
  - Compound Component 패턴 사용
  - Context로 상태 공유
  - 비즈니스 로직 금지

## 🎯 핵심 패턴

### Headless Hook Pattern
```typescript
// domains/record/hooks/useRecordList.ts
export const useRecordList = (filter?: RecordFilter) => {
  const { data } = useSuspenseQuery({
    queryKey: ['records', filter],
    queryFn: () => recordApi.getRecordList(filter),
  });

  return {
    records: data,
    // ... 상태와 액션만 반환
  };
};
```

### Compound Component Pattern
```typescript
// components/common/LayerPopup/LayerPopup.tsx
const LayerPopupContext = createContext<ReturnType<typeof useLayerPopup> | null>(null);

export const LayerPopup = ({ children }: { children: ReactNode }) => {
  const popup = useLayerPopup();
  return (
    <LayerPopupContext.Provider value={popup}>
      {children}
    </LayerPopupContext.Provider>
  );
};

LayerPopup.Trigger = ({ children }: { children: ReactNode }) => {
  const { open } = useContext(LayerPopupContext)!;
  return <button onClick={open}>{children}</button>;
};
```

### Transform Pattern
```typescript
// domains/record/api/transform.ts
export const transformRecordResponseToEntity = (response: RecordResponse): Record => ({
  recordId: response.recordId,
  thumbnailUrl: response.thumbnailUrl ?? '',
  videoUrl: response.videoUrl ?? '',
  createTime: response.createTime ?? new Date().toISOString(),
});
```

## 📊 의존성 방향

```
Controller (Page)
    ↓
Headless Hook
    ↓
Repository (API)
    ↓
Transform
```

**금지된 의존성**:
- Controller → Repository (직접 호출)
- Component → Repository (직접 호출)
- Repository → Headless Hook

## 🔄 비동기 처리

### AsyncBoundary 패턴
```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <AsyncBoundary
      pendingFallback={<Loading />}
      rejectedFallback={<ErrorFallback />}
    >
      <RecordList />
    </AsyncBoundary>
  );
}

// RecordList.tsx
function RecordList() {
  const { data } = useSuspenseQuery({
    queryKey: ['records'],
    queryFn: recordApi.getRecordList,
  });

  // data는 무조건 존재
  return <ul>{data.map(...)}</ul>;
}
```

## 📝 네이밍 규칙

### Hooks
- Headless Hook: `use[Domain][Action]` (예: `useRecordCreate`)
- API Hook: `use[Domain][Action]Query/Mutation` (예: `useRecordListQuery`)

### Components
- Root: `[Component].tsx` (예: `LayerPopup.tsx`)
- 하위: `[Component][Part].tsx` (예: `LayerPopupTrigger.tsx`)

### API
- Repository: `[domain]Api` (예: `recordApi`)
- Transform: `transform[Type]ResponseToEntity` (예: `transformRecordResponseToEntity`)

### Types
- Entity: 도메인 엔티티 (예: `Record`, `User`)
- Response: API 응답 타입 (예: `RecordResponse`)

## 🚀 개발 워크플로우

### 1. 새 기능 추가
1. `domains/[domain]/types/` - 타입 정의
2. `domains/[domain]/api/` - API 함수 작성
3. `domains/[domain]/hooks/` - Headless Hook 작성
4. `domains/[domain]/components/` - UI 컴포넌트 작성
5. `app/` - 페이지에서 조합

### 2. TDD 사이클
1. **Red**: 실패하는 테스트 작성
2. **Green**: 최소 코드로 테스트 통과
3. **Refactor**: 코드 개선

### 3. 코드 리뷰 체크리스트
- [ ] 레이어 분리 준수
- [ ] 의존성 방향 준수
- [ ] Headless Hook이 UI 반환하지 않음
- [ ] Compound Component가 비즈니스 로직 포함하지 않음
- [ ] AsyncBoundary 사용
- [ ] Transform 함수에서 완전한 Entity 반환

## 📚 참고 문서

- [아키텍처 가이드](.kiro/steering/architecture.md)
- [개발 가이드](.kiro/steering/development-guide.md)
- [테스트 가이드](.kiro/steering/testing.md)
- [Git 컨벤션](.kiro/steering/git-conventions.md)

## 🎉 리팩토링 완료 통계

- **제거/이동된 파일**: 47개
- **제거된 폴더**: constants/, api/modules/, api/hooks/
- **제거된 코드**: 약 2,700줄
- **전체 진행률**: 87%

### 남은 공통 파일
- `types/common.ts`: Pagination (범용 타입)
- `types/appScheme.ts`: 앱 스킴 관련 (범용 타입)
- `hooks/common.ts`: useDebounce, useDidMountEffect, useRunOnce
- `hooks/useIntersectionObserver.ts`: 무한 스크롤
- `hooks/getQueryClient.ts`: React Query 인프라
