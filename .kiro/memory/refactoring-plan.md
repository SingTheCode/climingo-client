# Headless Compound 패턴 리팩토링 계획

**작성일**: 2025-12-08  
**목표**: 헥사고날 아키텍처 → Headless Compound 패턴 전환

## 전환 목표

### 현재 아키텍처
- 헥사고날 아키텍처 (Controller → Service → State → Repository)
- 도메인별 폴더 구조 (`domains/`)
- 레이어 간 명확한 의존성 방향

### 목표 아키텍처
- **Headless Hook**: 로직과 상태를 관리하는 순수 Hook
- **Compound Component**: UI를 조립 가능한 작은 단위로 분리
- **Funnel Pattern**: 다단계 플로우를 한곳에서 관리

## 마이그레이션 로드맵

### ✅ Phase 1: 공통 UI 컴포넌트 (완료 - 2025-12-08)
**목표**: 재사용 가능한 UI를 Headless + Compound 패턴으로 전환

- [x] `LayerPopup` Headless Hook 패턴 적용 완료
  - `useLayerPopup.ts` 생성
  - Context API로 상태 공유
  - 기존 사용법 유지
- [x] `FloatingActionMenu` Headless Hook 패턴 적용 완료
  - `useFloatingActionMenu.ts` 생성
  - Compound Component로 분리 (Backdrop, Container, Items, Button)
  - Default 컴포넌트로 기존 동작 유지
- [x] `InputText` Headless Hook 패턴 적용 완료
  - `useInputText.ts` 생성
  - Field, Validation 컴포넌트로 분리
  - 레거시 래퍼로 기존 사용법 호환
- [ ] 다른 공통 컴포넌트 식별 및 적용
  - Modal, Dropdown, Tabs, Accordion 등

**완료된 디렉토리 구조**:
```
src/
├── components/
│   ├── LayerPopup/
│   │   ├── useLayerPopup.ts
│   │   ├── LayerPopup.tsx
│   │   └── index.ts
│   ├── FloatingActionMenu/
│   │   ├── useFloatingActionMenu.ts
│   │   ├── FloatingActionMenu.tsx
│   │   └── index.ts
│   ├── InputText/
│   │   ├── useInputText.ts
│   │   ├── InputText.tsx
│   │   ├── InputTextLegacy.tsx
│   │   └── index.ts
│   └── common/          # 기존 common 컴포넌트 유지
│       ├── Avatar.tsx
│       ├── Layout.tsx
│       └── ...
```

### ✅ Phase 2: 도메인 로직 전환 (완료 - 2025-12-08)
**목표**: 도메인별 폴더 구조로 재구성

- [x] `domains/` 폴더 생성
- [x] `record` 도메인 구조 생성 및 파일 이동
  - hooks, api, components, types 분리
- [x] `auth` 도메인 구조 생성 및 파일 이동
  - hooks, api, components, types 분리
- [x] `profile`, `jjikboul`, `place` 도메인 구조 생성
- [x] 기존 경로에서 re-export로 호환성 유지
  - `hooks/record/index.ts` → `domains/record/hooks/`
  - `api/modules/record.ts` → `domains/record/api/`
  - `types/record.ts` → `domains/record/types/`

**완료된 디렉토리 구조**:
```
src/
├── domains/
│   ├── record/
│   │   ├── hooks/
│   │   │   ├── useRecordListQuery.ts
│   │   │   ├── useDeleteRecordMutation.ts
│   │   │   └── useReportReasonQuery.ts
│   │   ├── api/
│   │   │   └── record.ts
│   │   ├── components/
│   │   │   ├── RecordList.tsx
│   │   │   ├── RecordDetail.tsx
│   │   │   └── ...
│   │   └── types/
│   │       └── record.ts
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── index.ts (useAuth)
│   │   ├── api/
│   │   │   └── user.ts
│   │   ├── components/
│   │   │   ├── SignUpForm.tsx
│   │   │   └── ...
│   │   └── types/
│   │       └── auth.ts
│   ├── profile/
│   ├── jjikboul/
│   └── place/
│
├── hooks/                         # Re-export for compatibility
│   ├── record/index.ts
│   └── auth/index.ts
│
├── api/modules/                   # Re-export for compatibility
│   ├── record.ts
│   └── user.ts
│
└── types/                         # Re-export for compatibility
    ├── record.ts
    └── auth.ts
```

### Phase 3: Funnel 패턴 도입 (2주)
**목표**: 다단계 플로우를 Funnel 패턴으로 관리

- [ ] `useFunnel` Hook 구현 (또는 `@toss/use-funnel` 설치)
- [ ] 다단계 플로우 페이지 식별
  - 회원가입, 주문, 결제, 설문조사 등
- [ ] 각 단계를 독립된 컴포넌트로 분리
  - `Step1_Cart.tsx`, `Step2_Address.tsx` 등
- [ ] 상위 Controller에서 전체 흐름 관리
  - `page.tsx`가 모든 단계와 상태 제어

**디렉토리 구조**:
```
src/
├── lib/
│   └── funnel/
│       ├── useFunnel.ts
│       └── Funnel.tsx
└── app/
    └── (order)/
        └── checkout/
            ├── page.tsx          # Funnel Controller
            └── steps/
                ├── Step1_Cart.tsx
                ├── Step2_Address.tsx
                ├── Step3_Payment.tsx
                └── Step4_Complete.tsx
```

### ✅ Phase 4: 전체 도메인 확장 및 정리 (완료 - 2025-12-08)
**목표**: 레거시 폴더 제거 및 완전한 도메인 구조로 전환

- [x] 모든 app 페이지의 import 경로를 domains로 수정
- [x] domains 내부 컴포넌트들의 import 경로 수정
- [x] 기존 hooks/, components/ 폴더 삭제
  - hooks/record, hooks/auth, hooks/profile, hooks/jjikboul, hooks/place
  - components/record, components/auth, components/profile, components/jjikboul, components/place
- [x] api/modules/ 폴더 정리
  - record.ts, user.ts, jjikboul.ts 삭제
- [x] types/ 폴더 정리
  - record.ts, auth.ts, jjikboul.ts 삭제
- [x] 레거시 re-export 완전 제거

**최종 디렉토리 구조**:
```
src/
├── domains/
│   ├── record/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── components/
│   │   └── types/
│   ├── auth/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── components/
│   │   └── types/
│   ├── profile/
│   │   ├── hooks/
│   │   └── components/
│   ├── jjikboul/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── components/
│   │   └── types/
│   └── place/
│       ├── hooks/
│       └── components/
│
├── components/                    # 공통 Headless + Compound UI
│   ├── LayerPopup/
│   ├── FloatingActionMenu/
│   ├── InputText/
│   └── common/                    # 기타 공통 컴포넌트
│
├── hooks/                         # 공통 hooks만 유지
│   ├── useIntersectionObserver.ts
│   ├── useAppScheme.ts
│   ├── useImageDownload.ts
│   ├── navigate.ts
│   ├── common.ts
│   └── getQueryClient.ts
│
├── api/
│   ├── axios.ts
│   ├── hooks/                     # React Query 공통 hooks
│   └── modules/
│       └── common.ts              # 공통 API만 유지
│
└── types/
    ├── common.ts                  # 공통 타입만 유지
    └── appScheme.ts
```

## 최종 디렉토리 구조

```
src/
├── components/                    # 공통 Headless + Compound UI
│   ├── Select/
│   ├── Modal/
│   └── Dropdown/
│
├── lib/                           # 유틸리티
│   ├── funnel/
│   └── api/
│
├── domains/                       # 도메인별 비즈니스 로직
│   └── product/
│       ├── components/            # 도메인 전용 UI
│       ├── hooks/                 # Headless Hook (로직)
│       ├── api/                   # Repository (API 통신)
│       └── types/                 # Entity
│
└── app/                           # Next.js App Router
    └── (product)/
        └── [id]/
            └── page.tsx           # Controller
```

## 의존성 방향 변경

### Before (헥사고날)
```
Page → Service → State → Repository
```

### After (Headless Compound)
```
Page (Controller)
  ↓
Headless Hook (로직 + 상태)
  ↓
Repository (API)
```

## 체크리스트

### 공통 작업
- [ ] `headless-compound-pattern.md` 문서 작성 완료
- [ ] `architecture.md`에 마이그레이션 안내 추가
- [ ] 팀원 교육 및 공유

### Phase별 완료 기준
- [ ] Phase 1: 공통 UI 컴포넌트 3개 이상 전환 완료
- [ ] Phase 2: 1개 도메인 완전 전환 및 테스트 통과
- [ ] Phase 3: 1개 Funnel 플로우 구현 완료
- [ ] Phase 4: 모든 도메인 전환 및 레거시 제거

## 주의사항

### 전환 시 유의점
- Service 클래스의 순수 비즈니스 로직은 Headless Hook 내부로 이동
- Repository는 변경하지 않음 (API 통신 담당 유지)
- 기존 테스트 코드는 Headless Hook 테스트로 전환
- 점진적 전환: 한 번에 모든 코드를 바꾸지 않음

### 금지 패턴
- Headless Hook에서 UI 컴포넌트 반환 금지
- Compound Component에서 비즈니스 로직 포함 금지
- 각 단계 컴포넌트에서 다음 단계 이동 로직 포함 금지
- Page에서 Repository 직접 호출 금지

## 참고 자료

- [headless-compound-pattern.md](./.kiro/steering/headless-compound-pattern.md)
- [Toss SLASH 23 - Funnel](https://www.youtube.com/watch?v=NwLWX2RNVcw)
- [@toss/use-funnel](https://github.com/toss/slash/tree/main/packages/react/use-funnel)
- [Compound Component Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
