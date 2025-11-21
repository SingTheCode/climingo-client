---
inclusion: always
---

# Climingo 헥사고날 아키텍처

## 아키텍처 개요

### 헥사고날 아키텍처 구조
```
┌─────────────────────────────────────────────────────────┐
│                    Driving Adapters                      │
│              (UI Components, Controllers)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Application Core    │
         │   (Business Logic)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Driven Ports        │
         │   (Repository Interface)│
         └───────────┬───────────┘
                     │
                     ▼
┌────────────────────┴────────────────────────────────────┐
│                    Driven Adapters                       │
│              (API, Database, External Services)          │
└─────────────────────────────────────────────────────────┘
```

### 레이어 구조
```
Driving Adapter (Component)
    ├─→ UI 로직
    └─→ Application Core (Business Logic) - 선택적
            └─→ Driven Port (Repository Interface)
                    └─→ Driven Adapter (API Implementation)
```

### 의존성 방향
1. **Driving Adapter (Component)**: UI 컴포넌트, useState/useMemo, Application Core 호출
2. **Application Core (Business Logic) - 선택적**: 순수 비즈니스 로직, Driven Port 사용
3. **Driven Port (Repository Interface)**: 데이터 접근 인터페이스
4. **Driven Adapter (Repository)**: API 통신

## 파일 구조

```
src/
├── app/                            # Next.js App Router
│   ├── (domain1)/                  # Domain1 라우트 그룹
│   └── (domain2)/                  # Domain2 라우트 그룹
│
└── domains/                        # 도메인별 비즈니스 로직
    ├── domain1/
    │   ├── components/             # Driving Adapter (UI)
    │   ├── hooks/                  # 도메인 내 공통 로직 (UI 관련)
    │   ├── ports/                  # Driven Ports (Repository Interface)
    │   ├── core/                   # Application Core (Business Logic)
    │   ├── api/                    # Driven Adapter (API Implementation)
    │   └── types/                  # Entity
    │
    └── domain2/
        ├── components/
        ├── hooks/
        ├── ports/
        ├── core/
        ├── api/
        └── types/
```

### 공통 코드 관리 규칙

두 개 이상의 도메인에서 같은 코드를 사용할 경우, 해당 도메인들을 포괄하는 상위 도메인을 생성합니다.

**예시 1: 인증 관련 공통 코드**
```
domains/
├── auth/                    # user와 admin의 상위 도메인
│   ├── components/
│   │   └── LoginForm.tsx   # user와 admin에서 공통 사용
│   ├── hooks/
│   └── types/
│       └── auth.ts
├── user/
│   └── components/
│       └── UserProfile.tsx
└── admin/
    └── components/
        └── AdminDashboard.tsx
```

**예시 2: 결제 관련 공통 코드**
```
domains/
├── payment/                 # order와 subscription의 상위 도메인
│   ├── components/
│   │   └── PaymentMethod.tsx
│   ├── hooks/
│   └── api/
│       └── PaymentApiAdapter.ts
├── order/
└── subscription/
```

### 도메인별 헥사고날 아키텍처 적용

각 도메인 폴더 내부는 헥사고날 아키텍처를 따릅니다:

```
domains/product/
├── components/                    # Driving Adapter
│   ├── ProductCard.tsx
│   └── ProductDetail.tsx
│
├── hooks/                         # 도메인 내 공통 로직
│   ├── useProductFilter.ts       # UI 상태 관리
│   └── useProductValidation.ts   # 폼 검증 로직
│
├── ports/                         # Driven Ports
│   └── IProductRepository.ts
│
├── core/                          # Application Core
│   └── ProductService.ts
│
├── api/                           # Driven Adapter
│   └── ProductApiAdapter.ts
│
└── types/                         # Entity
    └── product.d.ts
```

### hooks 폴더 사용 규칙

**hooks 폴더에 포함되는 것**:
- 도메인 내 여러 컴포넌트에서 공통으로 사용하는 UI 로직
- 폼 검증, 필터링, 정렬 등의 UI 관련 유틸리티
- React hooks (useState, useEffect 등) 사용하는 로직

**core 폴더와의 차이**:
- `hooks/`: UI 관련 공통 로직 (React hooks 사용 가능)
- `core/`: 순수 비즈니스 로직 (React hooks 사용 금지)

**예시**:
```typescript
// ✅ hooks/useProductFilter.ts - UI 관련 로직
export const useProductFilter = () => {
    const [filter, setFilter] = useState<Filter>({});
    
    const applyFilter = (newFilter: Filter) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
    };
    
    return { filter, applyFilter };
};

// ✅ core/ProductService.ts - 순수 비즈니스 로직
export class ProductService {
    calculateDiscount(price: number, rate: number): number {
        return price * (1 - rate);
    }
}
```

## 명명 규칙

| 레이어 | 패턴 | 예시 |
|--------|------|------|
| Driven Port | `I[Domain]Repository` | `IProductRepository` |
| Driven Adapter | `[Domain]ApiAdapter` | `ProductApiAdapter` |
| Application Core | `[Domain]Service` | `ProductService` |

### 상수 및 인터페이스
```typescript
// ✅ 상수는 camelCase
const stockStatus = {
    inStock: 'IN_STOCK',
    outOfStock: 'OUT_OF_STOCK'
};

// ✅ 인터페이스는 도메인 엔티티명 사용
interface Price {
    sellPrice: number;
    originalPrice: number;
}
```

## Driven Port - Repository Interface

```typescript
// @/domains/product/ports/IProductRepository.ts
export interface IProductRepository {
    getProductData(params: ProductRequestParams): Promise<ProductData>;
    updateProduct(id: string, data: Partial<ProductData>): Promise<void>;
}
```

## Driven Adapter - API 구현

```typescript
// @/domains/product/api/ProductApiAdapter.ts
import { IProductRepository } from '@/domains/product/ports/IProductRepository';

export class ProductApiAdapter implements IProductRepository {
    async getProductData(params: ProductRequestParams): Promise<ProductData> {
        const response = await fetch(`/api/info/${params.biztpCode}/${params.skuCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        return await response.json();
    }

    async updateProduct(id: string, data: Partial<ProductData>): Promise<void> {
        await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
}
```

### 필수 규칙
- Driven Port 인터페이스 구현
- 순수 API 통신만 담당 (비즈니스 로직 포함 금지)

## State Layer - 상태 관리

```typescript
// @/stores/review.ts (Zustand 예시)
import { create } from 'zustand';
import { reviewApi } from '@/lib/api/review';

interface ReviewState {
    bestReviewList: ReviewInfo[];
    loading: boolean;
    setBestReviewList: (reviews: ReviewInfo[]) => void;
    getBestReviewAll: () => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
    bestReviewList: [],
    loading: false,
    
    setBestReviewList: (reviews) => set({ bestReviewList: reviews }),
    
    getBestReviewAll: async () => {
        try {
            set({ loading: true });
            const response = await reviewApi.getBestReviewAllList();
            if (response?.status === 200) {
                set({ bestReviewList: response.data });
            }
        } finally {
            set({ loading: false });
        }
    }
}));
```

**또는 Context API 사용:**

```typescript
// @/stores/review.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { reviewApi } from '@/lib/api/review';

interface ReviewContextType {
    bestReviewList: ReviewInfo[];
    loading: boolean;
    setBestReviewList: (reviews: ReviewInfo[]) => void;
    getBestReviewAll: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [bestReviewList, setBestReviewList] = useState<ReviewInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const getBestReviewAll = async () => {
        try {
            setLoading(true);
            const response = await reviewApi.getBestReviewAllList();
            if (response?.status === 200) {
                setBestReviewList(response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReviewContext.Provider value={{ bestReviewList, loading, setBestReviewList, getBestReviewAll }}>
            {children}
        </ReviewContext.Provider>
    );
}

export const useReviewStore = () => {
    const context = useContext(ReviewContext);
    if (!context) throw new Error('useReviewStore must be used within ReviewProvider');
    return context;
};
```

## Application Core - 비즈니스 로직 (선택적)

```typescript
// @/domains/product/core/ProductService.ts
import { IProductRepository } from '@/domains/product/ports/IProductRepository';

export class ProductService {
    constructor(private repository: IProductRepository) {}

    async getProduct(id: string): Promise<ProductData> {
        const product = await this.repository.getProductData({ id });
        
        // 비즈니스 로직
        if (product.price.discountPercent > 50) {
            product.isHotDeal = true;
        }
        
        return product;
    }

    calculateFinalPrice(price: Price, quantity: number): number {
        const unitPrice = price.discountPercent > 0 
            ? price.discountedPrice 
            : price.sellPrice;
        return unitPrice * quantity;
    }
}
```

## Controller Layer - 컴포넌트

```typescript
// @/components/product/ProductCard.tsx
'use client';

import { useState, useMemo } from 'react';
import { useProductStore } from '@/stores/product';
import { useProductPriceCalculator } from '@/hooks/product';

export default function ProductCard() {
    const { product } = useProductStore();
    const { isDiscounted, calculateFinalPrice } = useProductPriceCalculator();
    const [quantity, setQuantity] = useState(1);

    const finalPrice = useMemo(
        () => calculateFinalPrice(product.price, quantity),
        [product.price, quantity, calculateFinalPrice]
    );

    const handleHighlightDiscount = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.classList.add('discount-highlight');
    };

    return (
        <div onClick={handleHighlightDiscount}>
            {/* UI 렌더링 */}
        </div>
    );
}
```

## 레이어별 체크리스트

| 레이어 | 해야 할 것 | 하면 안 되는 것 |
|--------|------------|----------------|
| **Controller** | Store 접근, useState/useMemo 선언, UI 로직, Service 호출(선택) | Repository 직접 접근 |
| **Hooks** | UI 관련 공통 로직, React hooks 사용 | 순수 비즈니스 로직 (core로 분리) |
| **Service (선택적)** | 순수 비즈니스 로직 (외부 의존성 없음) | Store 접근, DOM 조작, useState/useEffect 사용 |
| **State** | 상태 관리, API 호출 액션, 간단한 비즈니스 로직 | 복잡한 도메인 로직 (hooks로 분리) |
| **Repository** | API 통신 | 비즈니스 로직, 상태 변경 |

## 핵심 원칙

### 권장 패턴
- 간단한 경우: Controller → State → Repository (Service 생략)
- 복잡한 경우: Controller → Service + State → Repository
- Service: 순수 비즈니스 로직만, 외부 의존성 없음
- State: API 호출 + 상태 관리 + 간단한 로직
- UI 로직: 컴포넌트 내부 구현

### 금지 패턴
- Service(hooks)에서 Store, useState, useEffect 사용
- Service에서 `document.querySelector()` 등 DOM 조작
- Repository에서 비즈니스 로직 포함
- Controller에서 Repository 직접 호출

## 새로운 도메인 추가 시 구현 순서

1. 엔티티 정의 (`types/[domain].d.ts`)
2. Driven Port 정의 (`ports/I[Domain]Repository.ts`)
3. Driven Adapter 구현 (`api/[Domain]ApiAdapter.ts`)
4. 필요시 Application Core 구현 (`core/[Domain]Service.ts`)
5. 필요시 공통 UI 로직 구현 (`hooks/use[Feature].ts`)
6. Controller(컴포넌트) 구현
7. 테스트 작성
