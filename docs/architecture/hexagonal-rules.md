# 헥사고날 아키텍처 규칙

이 문서는 React + 헥사고날 아키텍처를 적용하기 위한 핵심 규칙을 정의합니다.

## 아키텍처 개요

### 계층 구조
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │ Infrastructure  │
│     Layer       │───▶│     Layer       │───▶│     Layer       │
│  (Controller)   │    │   (Service)     │    │  (Repository)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 폴더 매핑
```
src/
├── components/           # Presentation Layer (Controller)
├── hooks/               # Application Layer (Service/UseCase)  
├── api/
│   ├── hooks/          # Infrastructure Layer (Repository)
│   └── modules/        # Infrastructure Layer (API Client)
├── types/              # Domain Layer (Entity)
└── store/              # Application Layer (State Management)
```

## 의존성 규칙

### ✅ 허용되는 의존성

#### Controller (Components)
- `hooks/` 의존 허용 (Service Layer 사용)
- `types/` 의존 허용 (Domain Entity 사용)
- `store/` 의존 허용 (Global State 사용)

#### Service (hooks/)
- `api/hooks/` 의존 허용 (Repository 사용)
- `types/` 의존 허용 (Domain Entity 사용)
- `store/` 의존 허용 (State Management)

#### Repository (api/hooks/)
- `api/modules/` 의존 허용 (API Client 사용)
- `types/` 의존 허용 (Domain Entity로 변환)

### ❌ 금지되는 의존성

#### Controller (Components)
- `api/hooks/` 직접 의존 금지 → Service를 통해서만 접근
- `api/modules/` 직접 의존 금지

#### Service (hooks/)
- `components/` 의존 금지 (역방향 의존성)

#### Repository (api/hooks/)
- `hooks/` 의존 금지 (역방향 의존성)
- `components/` 의존 금지

## 계층별 책임

### Presentation Layer (Controller)
**역할**: UI 렌더링 및 사용자 상호작용
**책임**:
- JSX 렌더링
- 사용자 이벤트 처리
- Service 메서드 호출
- Service에서 받은 상태 표시
- 로딩/에러 UI 처리

**금지사항**:
- 비즈니스 로직 구현
- 직접적인 데이터 fetching
- 데이터 변환 로직

### Application Layer (Service)
**역할**: 비즈니스 로직 및 애플리케이션 플로우
**책임**:
- 비즈니스 규칙 구현
- 여러 Repository 조합 사용
- 데이터 변환 및 검증
- 복합적인 상태 관리
- 에러 처리 및 재시도 로직

### Infrastructure Layer (Repository)
**역할**: 데이터 접근 및 외부 시스템 연동
**책임**:
- 순수한 데이터 CRUD 작업
- 서버 응답을 도메인 객체로 변환
- React Query를 통한 캐싱 및 상태 관리
- API 에러 처리

## 코드 예시

### ✅ 올바른 패턴
```typescript
// Controller (Component)
function JjikbolShareDetail() {
  const { jjikbol, shareJjikbol, isLoading } = useJjikbol(id); // Service 사용
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      <h1>{jjikbol.title}</h1>
      <button onClick={shareJjikbol}>공유하기</button>
    </div>
  );
}

// Service (Hook)
const useJjikbol = (id: string) => {
  const { data, isLoading } = useGetJjikbolDetailQuery(id); // Repository 사용
  
  const shareJjikbol = useCallback(() => {
    if (data) {
      const transformedData = transformJjikbolData(data); // 비즈니스 로직
      shareToNative(transformedData);
    }
  }, [data]);
  
  return { jjikbol: data, shareJjikbol, isLoading };
};

// Repository
export const useGetJjikbolDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['jjikbol', id],
    queryFn: () => getJjikbolDetailApi(id), // API Client 사용
    select: (data) => JjikbolModel(data), // Domain 변환
  });
};
```

### ❌ 잘못된 패턴
```typescript
// ❌ Controller가 Repository 직접 의존
function JjikbolShareDetail() {
  const { data } = useGetJjikbolDetailQuery(id); // 금지!
  
  // ❌ Controller에서 비즈니스 로직 구현
  const handleShare = () => {
    const transformedData = { /* 변환 로직 */ }; // 금지!
    shareToNative(transformedData);
  };
  
  return <div onClick={handleShare}>{data.title}</div>;
}

// ❌ Repository가 비즈니스 로직 포함
export const useGetJjikbolDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['jjikbol', id],
    queryFn: () => getJjikbolDetailApi(id),
    select: (data) => {
      // ❌ Repository에서 복잡한 비즈니스 로직 금지
      const shareText = `${data.title}을 확인해보세요!`;
      return { ...JjikbolModel(data), shareText };
    },
  });
};
```

## ESLint 규칙 예시

헥사고날 아키텍처의 의존성 규칙을 강제하기 위한 방법:

### 방법 1: eslint-plugin-import 사용 (권장)

`eslint-plugin-import`의 `no-restricted-paths` 규칙을 사용하여 디렉토리 간 import를 제한합니다:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Components가 Repository를 직접 import하는 것을 금지
          {
            target: './src/components',
            from: './src/api/hooks',
            message: 'Components should not directly import Repository. Use Service layer instead.'
          },
          {
            target: './src/components',
            from: './src/api/modules',
            message: 'Components should not directly import API modules. Use Service layer instead.'
          },
          // Service가 Components를 import하는 것을 금지 (역방향 의존성)
          {
            target: './src/hooks',
            from: './src/components',
            message: 'Services should not import Components (circular dependency).'
          },
          // Repository가 Service나 Components를 import하는 것을 금지
          {
            target: './src/api/hooks',
            from: './src/hooks',
            message: 'Repository should not import Services (reverse dependency).'
          },
          {
            target: './src/api/hooks',
            from: './src/components',
            message: 'Repository should not import Components (reverse dependency).'
          }
        ]
      }
    ]
  }
};
```

**설치:**
```bash
npm install --save-dev eslint-plugin-import
```

### 방법 2: 디렉토리별 ESLint 설정

각 디렉토리에 `.eslintrc.js`를 배치하여 해당 디렉토리만의 규칙을 적용합니다:

```javascript
// src/components/.eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/api/hooks/*', '../api/hooks/*'],
            message: 'Components should not directly import Repository. Use Service layer instead.'
          },
          {
            group: ['@/api/modules/*', '../api/modules/*'],
            message: 'Components should not directly import API modules. Use Service layer instead.'
          }
        ]
      }
    ]
  }
};

// src/hooks/.eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/components/*', '../components/*'],
            message: 'Services should not import Components (circular dependency).'
          }
        ]
      }
    ]
  }
};

// src/api/hooks/.eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/hooks/*', '../../hooks/*'],
            message: 'Repository should not import Services (reverse dependency).'
          },
          {
            group: ['@/components/*', '../../components/*'],
            message: 'Repository should not import Components (reverse dependency).'
          }
        ]
      }
    ]
  }
};
```

## 핵심 원칙

1. **의존성 방향**: 항상 내부(도메인) 방향으로만 의존
2. **단일 책임**: 각 계층은 명확한 하나의 책임만 가짐
3. **추상화**: 상위 계층은 하위 계층의 구현 세부사항을 모름
4. **테스트 용이성**: 각 계층을 독립적으로 테스트 가능
5. **변경 격리**: 한 계층의 변경이 다른 계층에 영향을 최소화