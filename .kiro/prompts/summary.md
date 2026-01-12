# 성과 정리 프롬프트

## 사용 방법

특정 작성자의 연간 성과를 정리할 때 이 프롬프트를 사용합니다.

## 1단계: 커밋 태그 조회

```bash
cd /Users/emart/dev/emart/front_dev/frontend/front && git log --all --author="작성자명" --since="시작일" --until="종료일" --pretty=format:"%s" 2>/dev/null | grep -oE '\[SCRUM-[0-9]+\]|\[QA-[0-9]+\]' | sort | uniq -c | sort -rn
```

### 예시 (박재현/Singco)
```bash
cd /Users/emart/dev/emart/front_dev/frontend/front && git log --all --author="Singco\|박재현\|SingTheCode\|spiderq10" --since="2025-01-01" --until="2025-12-31" --pretty=format:"%s" 2>/dev/null | grep -oE '\[SCRUM-[0-9]+\]|\[QA-[0-9]+\]' | sort | uniq -c | sort -rn
```

### 커밋 수 필터링 (N개 이상)
```bash
# 5개 이상
... | awk '$1 >= 5 {print $0}'

# 4개 이상 5개 미만
... | awk '$1 >= 4 && $1 < 5 {print $0}'
```

## 2단계: 개별 태그 상세 조회

```bash
cd /Users/emart/dev/emart/front_dev/frontend/front && git log --all --author="작성자명" --grep="SCRUM-XXXXX" --pretty=format:"%h|%s" --stat 2>/dev/null | head -50
```

## 3단계: 연간 성과 요약 정리 (단일 파일)

1~2단계에서 수집한 정보를 바탕으로 **하나의 md 파일**에 전체 성과를 요약 정리합니다.

### 출력 파일
- 파일명: `[작성자]-achievements-[연도].md`
- 예시: `singco-achievements-2025.md`

### 파일 구조

```markdown
# [작성자명] [연도]년 주요 성과

> 정리 기간: YYYY-MM-DD ~ YYYY-MM-DD
> 총 커밋 수: 약 XXX+ 커밋

---

## 1. 작업 제목 (SCRUM-XXXXX)

**커밋 수**: X개 | **기간**: YYYY.MM ~ YYYY.MM

### 문제상황
- [기존 문제점 또는 요구사항]

### 주요 개선사항
- [구현/개선한 내용]

### 정량적 성과
- [측정 가능한 결과: 파일 수, 코드 줄 수, 성능 개선 등]

### 비즈니스 임팩트
- [비즈니스 관점의 효과]

---

## 2. 작업 제목 (SCRUM-XXXXX)
...

---

## N. QA 대응 (XX개+ 커밋)

**기간**: YYYY.MM ~ YYYY.MM

### 주요 QA 이슈 해결
- **QA-XXXX~XXXX**: [카테고리] 관련 버그 수정

### 정량적 성과
- QA 이슈 XX개+ 해결

---

## 기술 스택 & 도구

- **Frontend**: Vue 3, TypeScript, Pinia
- **Testing**: Jest, Playwright
- ...

---

## 연간 성과 요약

| 카테고리 | 성과 |
|----------|------|
| 총 커밋 수 | XXX+ |
| 주요 SCRUM 태스크 | XX+ |
| 코드 감소 | X,XXX+ 줄 (리팩토링) |
| 테스트 추가 | XX+ 케이스 |
| 신규 페이지 | X+ |

---

*마지막 업데이트: YYYY-MM-DD*
```

### 참고 사항

- 커밋 5개 이상인 작업을 주요 작업으로 분류
- Merge/Merged 커밋은 제외하고 카운트
- 관련 작업은 그룹화 (예: SCRUM-13369, 13749, 13750, 13751 → 댓글 시스템 개편)
- QA 대응은 별도 섹션으로 통합 정리
- **보충 내용은 포함하지 않음** (4단계에서 별도 파일로 작성)

---

## 4단계: 블로그 공유용 상세 보충 (개별 파일)

사용자가 3단계 성과 요약에서 **특정 번호를 선택**하면, 해당 작업에 대한 상세 보충 내용을 **별도 md 파일**로 작성합니다.

### 사용자 요청 예시

```
1, 3, 5번 작업에 대한 상세 보충 내용 작성해줘
```

### 출력 파일
- 파일명: `[작성자]-[연도]-[번호]-[작업명-kebab-case].md`
- 예시: `singco-2025-01-product-integration.md`

### 파일 구조

```markdown
# [작업 제목]

> SCRUM-XXXXX | 커밋 수: X개 | 기간: YYYY.MM ~ YYYY.MM

---

## 문제상황
- [기존 문제점 또는 요구사항]

## 주요 개선사항
- [구현/개선한 내용]

## 정량적 성과
- [측정 가능한 결과]

## 비즈니스 임팩트
- [비즈니스 관점의 효과]

---

## 기술적 구현 상세

### AS-IS

[기존 코드 구조의 문제점을 코드 예시와 함께 설명]

```typescript
// 기존 API 응답 구조 (예시 - 실제 구조 대신 더미 구조 사용)
interface OldResponse {
  field1: string;
  field2: number;
}
```

**문제점**:
- [구체적인 문제점 1]
- [구체적인 문제점 2]

### TO-BE

[개선된 구조를 코드 예시와 함께 설명]

```typescript
// 정규화된 엔티티 타입
interface NormalizedEntity {
  id: string;
  name: string;
}
```

### 핵심 구현

**1. [구현 항목 1]**

```typescript
// 핵심 로직만 포함, 비즈니스 로직은 주석으로 대체
export const transformFunction = (response: OldResponse): NormalizedEntity => {
  return {
    id: response.field1 ?? '',
    name: response.field2?.toString() ?? '',
  };
};
```

**2. [구현 항목 2]**

```typescript
// 비즈니스 로직 부분
const processData = async () => {
  // API 호출
  // 데이터 가공
  // 상태 업데이트
};
```

---

## 회고

### 잘한 점
- [잘한 점 1]

### 개선할 점
- [개선할 점 1]

### 배운 점
- [배운 점 1]
---

### 보충 대상 선정 기준

다음 유형의 작업에 우선적으로 보충 내용 작성:

- 아키텍처 개선 작업 (Transform 패턴, 레이어 분리 등)
- 성능 최적화 작업 (캐시, 이미지 리사이징 등)
- 공통 로직 추출 작업 (Composable, 유틸 함수 등)
- 테스트 환경 구축 작업

### 코드 예시 작성 규칙

1. **실제 비즈니스 로직 제외**: 주석으로 대체
   ```typescript
   // ❌ 실제 코드
   const price = product.salePrice * (1 - product.discountRate / 100);
   
   // ✅ 주석으로 대체
   // 할인가 계산 로직
   ```

2. **코드 예제 변환**: 실제 변수명, 필드명, 컴포넌트명 등을 일반적인 이름으로 변환
   - 변수명: `prdNo` → `productId`, `saleAmt` → `price`
   - 컴포넌트명: `UnifiedProductDetail` → `IntegratedItemDetail`
   - 함수명: `getQuickMenuList` → `fetchMenuList`
   
   ```typescript
   // ❌ 실제 코드
   interface ProductResponse {
     prdNo: string;
     prdNm: string;
     saleAmt: number;
   }
   
   // ✅ 변환된 코드
   interface ProductResponse {
     productId: string;
     productName: string;
     price: number;
   }
   ```

3. **핵심 패턴만 노출**: Transform, Composable 등 패턴의 구조만 보여줌

4. **단순 구현 내용은 주석으로 대체**: 특정 패턴/기법을 설명하는 목적이 아닌 단순 구현 코드는 주석으로 대체
   ```typescript
   // ❌ 단순 구현 내용을 그대로 노출
   const whalePosition = computed(() => {
     if (totalReward.value === 0) {
       return 0;
     }
     return calculatePosition(totalReward.value);
   });
   
   // ✅ 주석으로 대체
   // 고래 이미지 위치 계산 (최대 포인트 기준)
   ```
   
   **주석 대체 기준**:
   - 특정 패턴/기법을 설명하는 목적이 있는 코드 → 코드 노출 OK
   - 단순 CRUD, 조건 분기, 계산 로직 등 → 주석으로 대체
   - 예: `// 리워드링크 적립금 조회`, `// 월별 요약 내역 렌더링`

5. **주요 개선사항이 드러나는 코드 작성**: 기존/개선 비교로 변화가 명확히 보이도록 작성
   ```typescript
   // ❌ 변화가 드러나지 않는 예시
   const isAdultItem = computed(() => {
     // 성인 상품 여부 판단
   });
   
   // ✅ 변화가 드러나는 예시
   // 기존: 각 컴포넌트에 중복된 로직
   // PromotionItemDetail.vue
   const isAdult = item.adultFlag === 'Y';
   // StandardItemDetail.vue  
   const isAdult = item.adultFlag === 'Y';  // 동일 로직 중복
   
   // 개선: 통합 컴포넌트에서 공통 computed로 추출
   // IntegratedItemDetail.vue
   const isAdultItem = computed(() => item.value?.adultFlag === 'Y');
   ```

6. **핵심 구현 내 AS-IS/TO-BE 표현 금지**: 상위 소제목과 중복되므로 "기존/개선" 표현 사용

---

## 워크플로우 요약

```
1단계: 커밋 태그 조회
    ↓
2단계: 개별 태그 상세 조회
    ↓
3단계: 연간 성과 요약 정리 → [작성자]-achievements-[연도].md (단일 파일)
    ↓
4단계: 사용자가 번호 선택 → [작성자]-[연도]-[번호]-[작업명].md (개별 파일)
```
