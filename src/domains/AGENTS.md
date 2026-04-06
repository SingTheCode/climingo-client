# DOMAINS KNOWLEDGE BASE

각 도메인은 동일한 4-레이어 수직 슬라이스 구조. 도메인 간 직접 참조 금지 (ESLint 강제).

## STRUCTURE (모든 도메인 공통)

```
{domain}/
├── api/
│   ├── {domain}Api.ts      # API Client: fetch 호출 (get/create/update/deleteXxxApi)
│   └── transform.ts        # Response → Entity 변환 함수 ({Entity}Model)
├── hooks/
│   ├── use{Entity}.ts      # Service: 비즈니스 로직 조합
│   └── use{Action}{Entity}{Query|Mutation}.ts  # Repository: TanStack Query 래퍼
├── components/
│   └── {Feature}{Content}.tsx  # Presentation: UI 렌더링만
└── types/
    ├── entity.ts            # 클라이언트 도메인 모델 (camelCase)
    ├── response.ts          # 서버 응답 타입 (snake_case 그대로)
    └── index.ts             # barrel export
```

## DOMAIN MAP

### auth (14파일)

| 레이어    | 파일                                                   | 역할                                 |
| --------- | ------------------------------------------------------ | ------------------------------------ |
| API       | authApi.ts, transform.ts                               | OAuth 토큰 교환, 회원가입/탈퇴       |
| Hook      | useAuth, useNavigateWithAuth                           | 인증 상태 관리, 인증 필요 네비게이션 |
| Hook      | useOAuthMutation, useSignInMutation, useSignUpMutation | OAuth/로그인/회원가입 mutation       |
| Component | OAuth, OAuthButton, SignIn, SignUp                     | 로그인/회원가입 UI                   |

### jjikboul (11파일)

| 레이어    | 파일                           | 역할                             |
| --------- | ------------------------------ | -------------------------------- |
| API       | jjikboulApi.ts, transform.ts   | 찍볼 CRUD                        |
| Hook      | useJjikboul, useJjikboulUI     | 공유/저장 비즈니스 로직, UI 상태 |
| Hook      | useJjikboulDetailQuery         | 찍볼 상세 조회                   |
| Hook      | useAppScheme, useImageDownload | 앱 스킴 처리, 이미지 다운로드    |
| Component | JjikboulDetail                 | 찍볼 상세 페이지                 |

### place (9파일)

| 레이어    | 파일                            | 역할                                |
| --------- | ------------------------------- | ----------------------------------- |
| API       | placeApi.ts, transform.ts       | 클라이밍짐 검색/조회                |
| Hook      | useLevelListQuery               | 난이도 목록 조회                    |
| Component | Place, SearchedPlace, LevelIcon | 장소 표시, 검색 결과, 난이도 아이콘 |
| Constants | level.ts                        | 난이도 색상/라벨 상수               |

### profile (10파일)

| 레이어    | 파일                                            | 역할                |
| --------- | ----------------------------------------------- | ------------------- |
| API       | profileApi.ts, transform.ts                     | 프로필 조회/수정    |
| Hook      | useProfileQuery, useGetMyRecordListQuery        | 프로필/내 기록 조회 |
| Hook      | useEditNicknameMutation, useEditProfileMutation | 닉네임/프로필 수정  |
| Component | MyProfile, EditProfile                          | 프로필 표시/편집 UI |

### record (18파일) — 최대 도메인

| 레이어    | 파일                                            | 역할                         |
| --------- | ----------------------------------------------- | ---------------------------- |
| API       | recordApi.ts, transform.ts                      | 기록 CRUD, 신고              |
| Hook      | useRecordListQuery, useRecordDetailQuery        | 기록 목록/상세 조회          |
| Hook      | useRecordCreateMutation, useRecordActions       | 기록 생성, 액션(좋아요/신고) |
| Hook      | useReportReasonQuery                            | 신고 사유 목록               |
| Component | RecordList, RecordItem, RecordDetail            | 기록 목록/아이템/상세        |
| Component | RecordForm, UploadVideo, SelectPlaceWithLevel   | 기록 생성 폼                 |
| Component | FilterSection, ClearButton, Caution, ReportForm | 필터, 초기화, 주의사항, 신고 |
| Component | commonText.tsx                                  | 공통 텍스트 상수             |

## WHERE TO LOOK

| 작업                | 위치                                                                |
| ------------------- | ------------------------------------------------------------------- |
| 새 도메인 추가      | `domains/{name}/` 4개 폴더 생성 + ESLint 격리 규칙 추가             |
| API 엔드포인트 추가 | `domains/{name}/api/{name}Api.ts`                                   |
| 서버 응답 변환      | `domains/{name}/api/transform.ts`                                   |
| 비즈니스 로직 추가  | `domains/{name}/hooks/use{Entity}.ts`                               |
| 쿼리/뮤테이션 추가  | `domains/{name}/hooks/use{Action}{Entity}{Query\|Mutation}.ts`      |
| UI 컴포넌트 추가    | `domains/{name}/components/`                                        |
| 타입 정의           | `domains/{name}/types/entity.ts` (클라이언트), `response.ts` (서버) |

## CONVENTIONS (domains 고유)

- transform.ts에서 `{Entity}Model()` 함수로 Response→Entity 변환. null 안전: `?? ""`, `?? 0` 패턴.
- types/index.ts는 entity.ts + response.ts barrel export만 담당.
- place 도메인만 `constants/` 폴더 보유 (난이도 색상 매핑).
- record 도메인이 가장 크고 복잡 (11 components). 신규 기능 추가 시 컴포넌트 분리 주의.
