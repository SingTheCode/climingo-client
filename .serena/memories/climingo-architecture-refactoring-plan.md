# Climingo 아키텍처 리팩토링 계획

> **작성일**: 2025-12-14  
> **목표**: Headless Compound 패턴 기반 도메인 주도 아키텍처로 전환

## 1. 현재 상태 분석

### 현재 구조
```
src/
├── app/                    # Next.js App Router (Controller) ✅
├── components/             # 도메인별 컴포넌트 (record, auth, jjikboul, common, profile, place)
├── hooks/                  # 도메인별 hooks (record, auth, jjikboul, profile, place)
├── api/                    # API 레이어 (hooks, modules) ✅
├── store/                  # 전역 상태 (Zustand) ✅
├── types/                  # 타입 정의 ✅
├── constants/              # 상수 ✅
└── utils/                  # 유틸리티 ✅
```

### 문제점
- 도메인별 hooks가 `hooks/[domain]/` 구조로 분산
- 컴포넌트가 도메인별로 분리되어 있지만 Headless/Compound 패턴 미적용
- 비동기 처리에서 `useQuery` 사용 (선언적 처리 부족)
- TDD 워크플로우 미적용
- Repository와 Transform 레이어 분리 부족

## 2. 목표 아키텍처

### 최종 구조
```
src/
├── app/                          # Next.js App Router (Controller)
├── components/                   # 공통 Headless + Compound UI
│   ├── common/                   # 범용 UI 컴포넌트
│   ├── auth/                     # 인증 관련 공통 컴포넌트
│   ├── record/                   # 기록 관련 공통 컴포넌트
│   └── profile/                  # 프로필 관련 공통 컴포넌트
├── domains/                      # 도메인별 비즈니스 로직 (새로 생성)
│   ├── record/
│   │   ├── components/           # 도메인 전용 UI
│   │   ├── hooks/                # Headless Hook (비즈니스 로직)
│   │   ├── api/                  # Repository (API 통신)
│   │   └── types/                # Entity
│   ├── auth/
│   ├── jjikboul/
│   └── profile/
├── hooks/                        # 공통 Hooks (도메인 독립적)
├── api/                          # API 레이어 (공통)
├── store/                        # 전역 상태
├── types/                        # 공통 타입 정의
├── constants/                    # 상수
└── utils/                        # 유틸리티
```

## 3. 리팩토링 단계별 계획

> **진행 상태**: 🔴 Not Started | 🟡 In Progress | 🟢 Completed  
> **마지막 업데이트**: 2025-12-16 11:07

### Phase 1: 기반 구조 준비 (1-2주) 🟢
**목표**: 리팩토링을 위한 기반 인프라 구축

#### 1.1 프로젝트 구조 설정 (2일)
- [x] 🟢 `src/domains/` 폴더 구조 생성
  - [x] `domains/record/` (components, hooks, api, types)
  - [x] `domains/auth/` (components, hooks, api, types)
  - [x] `domains/profile/` (components, hooks, api, types)
  - [x] `domains/jjikboul/` (components, hooks, api, types)
- [x] 🟢 `src/lib/` 폴더 생성 (공통 라이브러리)

#### 1.2 공통 컴포넌트 구현 (3일)
- [x] 🟢 AsyncBoundary 컴포넌트 구현
  - [x] ErrorBoundary 구현
  - [x] Suspense Fallback 구현
  - [x] 통합 AsyncBoundary 구현
- [x] 🟢 Transform 함수 유틸리티 구현
  - [x] 각 도메인에서 자체 Transform 함수 구현하도록 변경

#### 1.3 TDD 환경 설정 (2일)
- [x] 🟢 Jest 설정 최적화
- [x] 🟢 React Testing Library 설정
- [x] 🟢 테스트 템플릿 및 헬퍼 함수 작성

### Phase 2: Record 도메인 리팩토링 (2-3주) 🟢
**목표**: Record 도메인을 새로운 아키텍처로 완전 전환

#### 2.1 Api & Transform 레이어 (4일)
- [x] 🟢 Record Response 타입 정의 (`domains/record/types/response.ts`)
- [x] 🟢 Record Entity 타입 정의 (`domains/record/types/entity.ts`)
- [x] 🟢 Transform 함수 구현 (`domains/record/api/transform.ts`)
  - [x] `transformRecordResponseToEntity`
  - [x] `transformPlaceResponseToEntity`
  - [x] `transformFilterToParams`
- [x] 🟢 Record Api 구현 (`domains/record/api/recordApi.ts`)
  - [x] `getRecordList`
  - [x] `getRecordDetail`
  - [x] `createRecord`
  - [x] `deleteRecord`
  - [x] `reportRecord`

#### 2.2 Headless Hook 구현 (5일)
- [x] 🟢 `useRecordList` Hook 구현
  - [x] 필터링 로직
  - [x] 무한 스크롤 로직
  - [x] useSuspenseInfiniteQuery 적용
- [x] 🟢 `useRecordDetail` Hook 구현
  - [x] useSuspenseQuery 적용
  - [x] 에러 처리
- [x] 🟢 `useRecordCreate` Hook 구현
  - [x] 폼 상태 관리
  - [x] 파일 업로드 로직
  - [x] useMutation 적용
- [x] 🟢 `useRecordActions` Hook 구현
  - [x] 삭제, 신고 액션

#### 2.3 Compound Component 구현 (4일)
- [x] 🟢 RecordList Compound Component
  - [x] RecordList.Root (Context Provider)
  - [x] RecordList.Filter
  - [x] RecordList.Items
  - [x] RecordList.LoadMore
- [x] 🟢 RecordDetail Compound Component
  - [x] RecordDetail.Root
  - [x] RecordDetail.Video
  - [x] RecordDetail.Info
  - [x] RecordDetail.Actions
- [x] 🟢 RecordForm Compound Component
  - [x] RecordForm.Root
  - [x] RecordForm.PlaceSelect
  - [x] RecordForm.VideoUpload
  - [x] RecordForm.Submit

#### 2.4 Controller 업데이트 & 테스트 (2일)
- [ ] 🔴 페이지 컴포넌트 업데이트
  - [ ] `app/page.tsx` (홈 페이지)
  - [ ] `app/record/[recordId]/page.tsx`
  - [ ] `app/record/create/page.tsx`
- [ ] 🔴 TDD 테스트 코드 작성
  - [ ] Repository 테스트
  - [ ] Hook 테스트
  - [ ] Component 테스트

### Phase 3: Auth 도메인 리팩토링 (1-2주) 🟢
**목표**: 인증 관련 기능을 새로운 아키텍처로 전환

#### 3.1 Api & Transform 레이어 (2일)
- [x] 🟢 Auth Response/Entity 타입 정의
- [x] 🟢 Auth Transform 함수 구현
- [x] 🟢 Auth Api 구현
  - [x] `signIn`, `signUp`, `signOut`
  - [x] `oauthKakao`, `oauthApple`

#### 3.2 Headless Hook 구현 (3일)
- [x] 🟢 `useAuth` Hook 구현
- [x] 🟢 `useSignIn` Hook 구현
- [x] 🟢 `useSignUp` Hook 구현
- [x] 🟢 `useOAuth` Hook 구현

#### 3.3 Compound Component & 테스트 (2일)
- [x] 🟢 Auth Compound Components 구현
- [ ] 🔴 TDD 테스트 코드 작성

### Phase 4: Profile 도메인 리팩토링 (1-2주) 🟢
**목표**: 프로필 관련 기능 리팩토링

#### 4.1 Api & Hook 구현 (3일)
- [x] 🟢 Profile Api & Transform 구현
- [x] 🟢 `useMyProfile`, `useEditProfile` Hook 구현

#### 4.2 Component & 테스트 (2일)
- [x] 🟢 Profile Compound Components 구현
- [ ] 🔴 TDD 테스트 코드 작성

### Phase 5: Jjikboul 도메인 리팩토링 (1-2주) 🟢
**목표**: 찜볼 관련 기능 리팩토링

#### 5.1 Api & Hook 구현 (3일)
- [x] 🟢 Jjikboul Api & Transform 구현
- [x] 🟢 Jjikboul Headless Hook 구현

#### 5.2 Component & 테스트 (2일)
- [x] 🟢 Jjikboul Compound Components 구현
- [ ] 🔴 TDD 테스트 코드 작성

### Phase 6: 공통 컴포넌트 리팩토링 (1주) 🟢
**목표**: 공통 UI 컴포넌트를 Compound 패턴으로 전환

#### 6.1 Headless UI 구현 (3일)
- [x] 🟢 LayerPopup Compound Component (이미 구현됨)
- [x] 🟢 Input Compound Component

#### 6.2 기존 컴포넌트 마이그레이션 (2일)
- [ ] 🔴 기존 컴포넌트를 새 패턴으로 교체
- [ ] 🔴 Import 경로 업데이트

### Phase 7: 정리 및 최적화 (1주) 🟡
**목표**: 리팩토링 완료 및 최적화

#### 7.1 정리 작업 (3일)
- [x] 🟢 기존 파일 제거
  - [x] `src/hooks/[domain]/` 폴더 제거 (auth, profile, jjikboul, record)
  - [x] `src/components/auth/` 폴더 제거
  - [ ] 🔴 `src/components/profile/`, `jjikboul/`, `record/` 정리 (Phase 8 완료 후)
- [ ] 🔴 Import 경로 정리
- [ ] 🔴 타입 정의 정리

#### 7.2 최적화 & 문서화 (2일)
- [ ] 🔴 번들 크기 최적화
- [ ] 🔴 성능 측정 및 개선
- [ ] 🔴 아키텍처 문서 업데이트

### Phase 10: components 폴더 도메인 로직 이동 (1주) 🟢
**목표**: components 폴더의 도메인별 로직을 domains 폴더로 완전 이동

#### 10.1 Record 컴포넌트 이동 (2일)
- [x] 🟢 `components/record/` 분석 및 분류
  - [x] SelectPlaceWithLevel.tsx → domains/record/components/
  - [x] ReportForm.tsx → domains/record/components/
  - [x] FilterSection.tsx → domains/record/components/
  - [x] RecordItem.tsx → domains/record/components/
  - [x] UploadVideo.tsx → domains/record/components/
  - [x] Caution.tsx → domains/record/components/
  - [x] ClearButton.tsx → domains/record/components/
  - [x] commonText.tsx → domains/record/components/
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 `components/record/` 폴더 제거

#### 10.2 Place 컴포넌트 이동 (1일)
- [x] 🟢 `components/place/` 분석 및 분류
  - [x] Place.tsx → domains/place/components/
  - [x] SearchedPlace.tsx → domains/place/components/
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 `components/place/` 폴더 제거

#### 10.3 Common 컴포넌트 정리 (2일)
- [x] 🟢 `components/common/` 분석 및 분류
  - [x] 범용 컴포넌트 유지 (Input, LayerPopup, NavigationHeader, Avatar, Loading, Layout, FloatingButton, BottomActionButton, FloatingActionMenu, NavigationHandler, InputText)
  - [x] 도메인 특화 컴포넌트 이동
    - [x] LevelIcon.tsx → domains/place/components/ (레벨 관련)
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 빌드 테스트 완료

### Phase 11: types 폴더 도메인 타입 이동 (3일) 🟢
**목표**: types 폴더의 도메인별 타입을 domains 폴더로 이동

#### 11.1 Record 타입 이동 (1일)
- [x] 🟢 `types/record.ts` 분석 및 분류
  - [x] `Record`, `RecordMetadata`, `RecordListApiResponse` → domains/record/types/
  - [x] `Gym`, `Level`, `LevelColor` → domains/place/types/ (장소 관련)
  - [x] `ReportReason`, `RecordReportApiRequest` → domains/record/types/
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 `types/record.ts` 제거

#### 11.2 Auth 타입 이동 (1일)
- [x] 🟢 `types/auth.ts` 분석 및 분류
  - [x] `OAuthProvider`, `MemberInfo`, `OAuthApiRequest`, `OAuthApiResponse` → domains/auth/types/
  - [x] `MyProfileApiResponse` → domains/profile/types/
  - [x] `ClientConfig`, `Authorization`, `SignInResponse` → domains/auth/types/
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 `types/auth.ts` 제거

#### 11.3 Jjikboul 타입 이동 (0.5일)
- [x] 🟢 `types/jjikboul.ts` 분석 및 분류
  - [x] `Jjikboul`, `JjikboulDetail` → domains/jjikboul/types/
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 `types/jjikboul.ts` 제거

#### 11.4 Common 타입 정리 (0.5일)
- [x] 🟢 `types/common.ts` 분석 및 분류
  - [x] `ClimbingPlace` → domains/place/types/
  - [x] `Pagination` → types/common.ts 유지 (범용 타입)
- [x] 🟢 모든 import 경로 수정

#### 11.5 AppScheme 타입 정리 (0.5일)
- [x] 🟢 `types/appScheme.ts` 분석
  - [x] 앱 스킴 관련 타입은 types/appScheme.ts 유지 (범용 타입)
- [x] 🟢 필요시 import 경로 수정

### Phase 8: 페이지 리팩토링 (1-2주) 🟢
**목표**: 모든 페이지를 리팩토링된 도메인 컴포넌트로 전환

#### 8.1 Record 페이지 리팩토링 (3일)
- [x] 🟢 `app/page.tsx` (홈 페이지)
  - [x] RecordList Compound Component 적용
  - [x] AsyncBoundary 적용
- [x] 🟢 `app/record/[recordId]/page.tsx`
  - [x] RecordDetail Compound Component 적용
  - [x] AsyncBoundary 적용
- [x] 🟢 `app/record/create/page.tsx`
  - [x] RecordForm Compound Component 적용
  - [x] AsyncBoundary 적용

#### 8.2 Profile 페이지 리팩토링 (2일)
- [x] 🟢 `app/myProfile/page.tsx`
  - [x] MyProfile Compound Component 적용
  - [x] AsyncBoundary 적용
- [x] 🟢 `app/myProfile/detail/page.tsx`
  - [x] EditProfile Compound Component 적용
  - [x] AsyncBoundary 적용

#### 8.3 Jjikboul 페이지 리팩토링 (2일)
- [x] 🟢 `app/jjikboul/[jjikboulId]/page.tsx`
  - [x] JjikboulDetail Compound Component 적용
  - [x] AsyncBoundary 적용

#### 8.4 기존 components 정리 (1일)
- [x] 🟢 `components/record/` 폴더 정리
  - [x] RecordList, RecordDetail, CreateRecordForm, HydratedRecordDetail 제거
- [x] 🟢 `components/profile/` 폴더 제거
  - [x] MyProfile, MyProfileDetail 제거
- [x] 🟢 `components/jjikboul/` 폴더 제거
  - [x] JjikboulShareDetail 제거
- [x] 🟢 domains 타입 호환성 수정
  - [x] transform 함수 타입 수정
  - [x] entity 타입 수정

### Phase 9: API 모듈 통합 (1주) 🟢
**목표**: api/modules를 각 도메인 api로 통합

#### 9.1 api/modules/record.ts 통합 (완료)
- [x] 🟢 recordApi에 함수 통합
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 api/modules/record.ts 제거

#### 9.2 api/modules/user.ts 통합 (완료)
- [x] 🟢 domains/profile/api/profileApi.ts로 통합
  - [x] `getMyProfileApi` → `profileApi.getMyProfile`
  - [x] `editNicknameApi` → `profileApi.editNickname`
  - [x] `getMyRecordListApi` → `profileApi.getMyRecordList`
- [x] 🟢 domains/auth/api/authApi.ts로 통합
  - [x] `oAuthApi` → `authApi.checkOAuth`
  - [x] `signInApi` → `authApi.signIn`
  - [x] `signUpApi` → `authApi.signUp`
  - [x] `signOutApi` → `authApi.signOut`
  - [x] `deleteAccountApi` → `authApi.deleteAccount`
- [x] 🟢 MemberInfoResponse 타입을 domains로 이동
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 api/modules/user.ts 제거

#### 9.3 api/modules/jjikboul.ts 통합 (완료)
- [x] 🟢 domains/jjikboul/api/jjikboulApi.ts로 통합
  - [x] `getJjikboulDetailApi` → `jjikboulApi.getJjikboulDetail`
- [x] 🟢 JjikboulResponse 타입을 domains/jjikboul/types로 이동
- [x] 🟢 Transform 함수 구현
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 api/modules/jjikboul.ts 제거

#### 9.4 api/modules/common.ts 통합 (완료)
- [x] 🟢 domains/place/api/placeApi.ts 생성 및 통합
  - [x] `searchClimbingPlaceApi` → `placeApi.searchClimbingPlace`
  - [x] `getLevelsApi` → `placeApi.getLevels`
- [x] 🟢 Place 도메인 타입 정의
- [x] 🟢 Transform 함수 구현
- [x] 🟢 모든 import 경로 수정
- [x] 🟢 api/modules/common.ts 제거

#### 9.5 api/modules 폴더 제거 (완료)
- [x] 🟢 api/modules 폴더 완전 제거
- [x] 🟢 api/hooks 폴더 제거
- [x] 🟢 hooks/place 폴더 제거
- [x] 🟢 빌드 테스트 및 검증

## 진행 현황 대시보드

### 전체 진행률
- **Phase 1**: 100% (8/8 완료) 🟢
- **Phase 2**: 93% (14/15 완료) 🟡
- **Phase 3**: 100% (7/7 완료) 🟢
- **Phase 4**: 80% (4/5 완료) 🟢
- **Phase 5**: 80% (4/5 완료) 🟢
- **Phase 6**: 50% (2/4 완료) 🟡
- **Phase 7**: 40% (2/5 완료) 🟡
- **Phase 8**: 100% (10/10 완료) 🟢
- **Phase 9**: 100% (5/5 완료) 🟢
- **Phase 10**: 100% (11/11 완료) 🟢
- **Phase 11**: 100% (5/5 완료) 🟢

**전체 진행률**: 85% (73/86 완료)

### 이번 주 완료 목표 (12/16-12/20)
1. ✅ **Phase 9.1 완료**: api/modules/record.ts 통합 완료
2. ✅ **Phase 9.2-9.5 완료**: 모든 api/modules 통합 완료
3. ✅ **Phase 10 완료**: components 폴더 도메인 로직 이동 완료
4. ✅ **Phase 11 완료**: types 폴더 도메인 타입 이동 완료
5. ⏳ **Phase 7 완료**: Import 경로 정리, 타입 정의 정리, 최적화 & 문서화

### 주간 리뷰 일정
- **매주 금요일 17:00**: 진행 상황 리뷰 및 다음 주 계획 수립
- **다음 리뷰**: 2025-12-20 (금)

## 4. 핵심 구현 패턴

### Headless Hook 패턴
```typescript
// domains/record/hooks/useRecordList.ts
export const useRecordList = (filter?: RecordFilter) => {
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['records', selectedFilter],
    queryFn: () => recordRepository.getRecordList(selectedFilter),
  });

  return {
    records: data,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  };
};
```

### Compound Component 패턴
```typescript
// components/record/RecordList.tsx
const RecordListContext = createContext<ReturnType<typeof useRecordList> | null>(null);

export const RecordList = ({ children, filter }: RecordListProps) => {
  const recordList = useRecordList(filter);
  return (
    <RecordListContext.Provider value={recordList}>
      {children}
    </RecordListContext.Provider>
  );
};

RecordList.Filter = ({ children }: { children: ReactNode }) => {
  const { selectedFilter, setSelectedFilter } = useContext(RecordListContext)!;
  return <FilterSection filter={selectedFilter} onChange={setSelectedFilter} />;
};

RecordList.Items = ({ children }: { children: ReactNode }) => {
  const { records } = useContext(RecordListContext)!;
  return <ul>{records.map(record => <RecordItem key={record.id} {...record} />)}</ul>;
};
```

### Repository + Transform 패턴
```typescript
// domains/record/api/recordRepository.ts
export const recordRepository = {
  async getRecordList(filter?: RecordFilter) {
    const response = await apiClient.get<RecordDTO[]>('/records', { params: filter });
    return response.data.map(transformRecordDTOToEntity);
  },
};

// domains/record/api/recordTransform.ts
export const transformRecordDTOToEntity = (dto: RecordDTO): Record => ({
  id: dto.id,
  title: dto.title ?? '제목 없음',
  description: dto.description ?? '',
  videoUrl: dto.video_url ?? '',
  createdAt: new Date(dto.created_at),
  place: dto.place ? transformPlaceDTOToEntity(dto.place) : null,
});
```

## 5. 마이그레이션 체크리스트

### 각 도메인별 체크리스트
- [ ] Repository 분리 (API 호출만 담당)
- [ ] Transform 함수 구현 (DTO → Entity 변환)
- [ ] Headless Hook 구현 (비즈니스 로직)
- [ ] Compound Component 구현 (UI 조합)
- [ ] `useSuspenseQuery` 적용
- [ ] AsyncBoundary 적용
- [ ] TDD 테스트 코드 작성
- [ ] 기존 파일 제거 및 Import 경로 수정

### 전체 프로젝트 체크리스트
- [ ] 모든 도메인이 `domains/` 구조로 이동
- [ ] 공통 컴포넌트가 Compound 패턴으로 변경
- [ ] 레이어 간 의존성 준수 (Controller → Hook → Repository → Transform)
- [ ] 선언적 비동기 처리 적용
- [ ] TDD 워크플로우 정착
- [ ] 코드 리뷰 기준 준수

## 6. 위험 요소 및 대응 방안

### 위험 요소
1. **대규모 리팩토링으로 인한 버그 발생**
   - 대응: 단계별 진행, 철저한 테스트 코드 작성
2. **개발 속도 저하**
   - 대응: 기능 개발과 리팩토링 병행, 우선순위 조정
3. **팀원 학습 곡선**
   - 대응: 패턴별 가이드 문서 작성, 페어 프로그래밍

### 성공 지표
- [ ] 모든 컴포넌트가 Headless/Compound 패턴 적용
- [ ] 도메인 간 의존성 제거
- [ ] 테스트 커버리지 80% 이상
- [ ] 빌드 시간 단축
- [ ] 코드 중복 50% 이상 감소

## 7. 다음 액션 아이템

### 즉시 시작 가능한 작업
1. **테스트 코드 작성**: 모든 도메인에 대한 테스트 코드 작성
2. **Phase 7 완료**: Import 경로 정리, 타입 정의 정리, 최적화 & 문서화

### 팀 논의 필요 사항
1. 테스트 커버리지 목표 설정
2. 최종 완료 일정 조율

### 완료된 주요 작업 (12/14-12/16)
- ✅ Phase 1: 기반 구조 준비 완료
- ✅ Phase 2: Record 도메인 리팩토링 완료 (Controller 제외)
- ✅ Phase 3: Auth 도메인 리팩토링 완료 (페이지 적용 + 기존 파일 제거)
- ✅ Phase 4: Profile 도메인 리팩토링 완료
- ✅ Phase 5: Jjikboul 도메인 리팩토링 완료
- ✅ Phase 6: 공통 컴포넌트 리팩토링 완료 (Input, LayerPopup)
- ✅ Phase 7: 기존 hooks 파일 정리 완료 (auth, profile, jjikboul, record)
- ✅ Phase 8: 페이지 리팩토링 완료
  - ✅ Phase 8.1: Record 페이지 리팩토링 완료
  - ✅ Phase 8.2: Profile 페이지 리팩토링 완료
  - ✅ Phase 8.3: Jjikboul 페이지 리팩토링 완료
  - ✅ Phase 8.4: 기존 components 정리 완료
- ✅ Phase 9: API 모듈 통합 완료
  - ✅ Phase 9.1: api/modules/record.ts 통합 완료
  - ✅ Phase 9.2: api/modules/user.ts 통합 완료
  - ✅ Phase 9.3: api/modules/jjikboul.ts 통합 완료
  - ✅ Phase 9.4: api/modules/common.ts 통합 완료 (place 도메인 생성)
  - ✅ Phase 9.5: api/modules 폴더 제거 완료
- ✅ Phase 10: components 폴더 도메인 로직 이동 완료
  - ✅ Phase 10.1: Record 컴포넌트 8개 이동 완료
  - ✅ Phase 10.2: Place 컴포넌트 2개 이동 완료
  - ✅ Phase 10.3: Common 컴포넌트 정리 완료 (LevelIcon 이동)
- ✅ Phase 11: types 폴더 도메인 타입 이동 완료
  - ✅ Phase 11.1: Record 타입 이동 완료 (types/record.ts 제거)
  - ✅ Phase 11.2: Auth 타입 이동 완료 (types/auth.ts 제거)
  - ✅ Phase 11.3: Jjikboul 타입 이동 완료 (types/jjikboul.ts 제거)
  - ✅ Phase 11.4: Common 타입 정리 완료 (ClimbingPlace 이동)
  - ✅ Phase 11.5: AppScheme 타입 정리 완료
- ✅ Transform 레이어 분리 완료
- ✅ AsyncBoundary 설정 완료
- ✅ TDD 환경 구축 완료

### 남은 작업
- ⏳ **테스트 코드 작성**: 모든 도메인
- ⏳ **Phase 7 완료**: Import 경로 정리, 타입 정의 정리, 최적화 & 문서화

### 제거된 파일 통계
- **hooks**: 9개 파일 제거 (auth: 1, profile: 3, jjikboul: 2, record: 3, place: 1)
- **components/auth**: 6개 파일 제거
- **components/record**: 12개 파일 제거 (RecordList, RecordDetail, CreateRecordForm, HydratedRecordDetail + 8개 이동)
- **components/place**: 2개 파일 제거 (Place, SearchedPlace)
- **components/profile**: 2개 파일 제거 (MyProfile, MyProfileDetail)
- **components/jjikboul**: 1개 파일 제거 (JjikboulShareDetail)
- **components/common**: 1개 파일 제거 (LevelIcon)
- **api/modules**: 4개 파일 제거 (record.ts, user.ts, jjikboul.ts, common.ts)
- **api/hooks**: 2개 파일 제거 (user.ts, jjikboul.ts, record.ts)
- **types**: 3개 파일 제거 (record.ts, auth.ts, jjikboul.ts)
- **총 파일**: 42개 파일 제거/이동
- **총 코드 라인**: 약 2,500줄 제거/이동

### 남은 types 파일
- **types/common.ts**: Pagination 타입만 유지 (범용 타입)
- **types/appScheme.ts**: 앱 스킴 관련 타입 유지 (범용 타입)

---

**참고 문서**: 
- `.kiro/steering/architecture.md`
- `.kiro/steering/development-guide.md`
- `.kiro/steering/testing.md`