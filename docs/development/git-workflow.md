# Git 워크플로우 가이드

이 문서는 Climingo 프로젝트의 Git 워크플로우와 브랜치 전략을 정의합니다.

## 브랜치 전략

### 브랜치 구조
```
main
├── develop
├── feature/#이슈번호_기능명
├── bugfix/#이슈번호_버그명
└── releases/YYYY-MM-DD
```

### 브랜치 설명

#### `main`
- **목적**: 프로덕션 배포용 브랜치
- **보호**: 직접 푸시 금지, PR을 통해서만 병합
- **배포**: 이 브랜치에 머지되면 자동 배포

#### `develop` 
- **목적**: 개발 통합 브랜치 (필요시 사용)
- **용도**: 통합 테스트 및 스테이징 환경
- **테스트**: 통합 테스트 실행

#### `feature/#이슈번호_기능명`
- **목적**: 새로운 기능 개발
- **네이밍**: `feature/#166_jjikbol-share`
- **생성**: main에서 분기
- **병합**: main으로 PR

#### `bugfix/#이슈번호_버그명`
- **목적**: 버그 수정 (긴급하지 않은 일반 버그)
- **네이밍**: `bugfix/#145_infinite-scroll-fix`
- **생성**: main에서 분기
- **병합**: main으로 PR

#### `releases/YYYY-MM-DD`
- **목적**: 배포 준비 (버전 업데이트, 최종 테스트)
- **네이밍**: `releases/2024-01-15`
- **생성**: main에서 분기
- **병합**: main으로 PR 후 develop에도 병합

## 커밋 메시지 규칙

### 형식 (Feature/Bugfix 브랜치)
Feature 또는 Bugfix 브랜치에서 작업할 때는 브랜치명에서 이슈번호를 추출하여 커밋 메시지에 포함합니다.

```
[#이슈번호] 타입: 제목 (50자 이내)

본문 (72자로 줄바꿈, 선택사항)
- 상세 설명
- 변경 사항 목록

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 형식 (기타 브랜치)
Release 등 기타 브랜치에서는 기존 형식을 사용합니다.

```
타입: 제목 (50자 이내)

본문 (72자로 줄바꿈, 선택사항)
- 상세 설명
- 변경 사항 목록

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 스타일 변경 (포맷팅, 세미콜론 등)
- `test`: 테스트 추가 또는 수정
- `docs`: 문서 수정
- `chore`: 빌드 프로세스나 보조 도구 변경
- `perf`: 성능 개선
- `ci`: CI/CD 관련 변경

### 좋은 커밋 메시지 예시

#### Feature 브랜치 (feature/#132_boilerplating)
```
[#132] feat: 보일러플레이팅 구현

- 프로젝트 기본 구조 설정
- TypeScript 설정 완료
- ESLint 및 Prettier 구성
- 기본 컴포넌트 템플릿 생성

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### Feature 브랜치 (feature/#166_jjikbol-share)
```
[#166] feat: 찍볼 공유 기능 구현

- 찍볼 상세 정보 조회 API 연동
- 네이티브 공유 API 통합
- 웹 공유 미지원시 클립보드 복사 기능
- 이미지 저장 안내 기능 추가

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### Bugfix 브랜치 (bugfix/#145_infinite-scroll-fix)
```
[#145] fix: 찍볼 목록 무한스크롤 버그 수정

- hasNextPage가 false일 때도 로딩이 계속되는 문제 해결
- 중복 API 호출 방지 로직 추가
- 에러 상태에서 재시도 버튼 동작 개선

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### Release 브랜치 (releases/2024-01-15)
```
release: v1.2.0 배포 준비

- package.json 버전 1.2.0 업데이트
- CHANGELOG.md 업데이트
- 프로덕션 환경 설정 최종 확인

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 풀 리퀘스트 (PR) 가이드

### PR 제목 형식
```
[#이슈번호] 타입: 간단한 설명
```

**예시**: `[#166] feat: 찍볼 공유 기능 구현`

### PR 템플릿
```markdown
## 개요
이 PR에서 해결하려는 문제나 구현하려는 기능에 대한 간단한 설명

## 변경사항
- [ ] 주요 변경사항 1
- [ ] 주요 변경사항 2
- [ ] 주요 변경사항 3

## 테스트
- [ ] 단위 테스트 작성/수정
- [ ] 통합 테스트 확인
- [ ] E2E 테스트 확인 (필요시)
- [ ] 수동 테스트 완료

## 스크린샷 (UI 변경시)
Before: (변경 전 스크린샷)
After: (변경 후 스크린샷)

## 체크리스트
- [ ] 코드 리뷰 완료
- [ ] 테스트 통과 확인
- [ ] 문서 업데이트 (필요시)
- [ ] Breaking Change 없음 (있다면 설명)
- [ ] 성능 영향 검토 완료

## 관련 이슈
Closes #이슈번호
```

### PR 리뷰 가이드

#### 리뷰어가 확인할 사항
1. **코드 품질**
   - 코딩 표준 준수
   - 네이밍 규칙 일관성
   - 헥사고날 아키텍처 규칙 준수

2. **기능성**
   - 요구사항 충족
   - 예외 상황 처리
   - 사용자 경험 고려

3. **성능**
   - 불필요한 리렌더링 없음
   - 메모리 누수 가능성 없음
   - 번들 사이즈 영향 최소화

4. **보안**
   - 입력값 검증
   - XSS, CSRF 등 보안 취약점 없음
   - 민감한 정보 노출 없음

5. **테스트**
   - 테스트 커버리지 적절
   - 핵심 로직 테스트 존재
   - Edge case 고려

#### 리뷰 코멘트 작성 가이드
```markdown
# 좋은 리뷰 코멘트 예시

## 💡 제안
이 부분은 useMemo를 사용해서 최적화할 수 있을 것 같습니다.

## ❓ 질문  
이 함수에서 empty string을 반환하는 경우는 언제인가요?

## 🐛 버그
null 체크가 없어서 런타임 에러가 발생할 수 있습니다.

## 👍 칭찬
헥사고날 아키텍처 원칙을 잘 지킨 깔끔한 코드네요!

## 📝 문서
이 함수에 JSDoc 주석을 추가하면 더 좋을 것 같습니다.
```

## 개발 워크플로우

### 새로운 기능 개발
```bash
# 1. main 브랜치에서 최신 코드 pull
git checkout main
git pull origin main

# 2. feature 브랜치 생성
git checkout -b feature/#166_jjikbol-share

# 3. 개발 진행
# ... 코드 작성 ...

# 4. 변경사항 커밋 (브랜치명에서 이슈번호 추출)
git add .
git commit -m "[#166] feat: 찍볼 공유 기능 구현"

# 5. 원격 저장소에 push
git push origin feature/#166_jjikbol-share

# 6. PR 생성
# GitHub에서 main으로 PR 생성

# 7. 리뷰 후 병합
# 리뷰 완료 후 main에 병합
```

### 버그 수정 개발
```bash
# 1. main 브랜치에서 최신 코드 pull
git checkout main
git pull origin main

# 2. bugfix 브랜치 생성
git checkout -b bugfix/#145_infinite-scroll-fix

# 3. 버그 수정 진행
# ... 코드 수정 ...

# 4. 변경사항 커밋 (브랜치명에서 이슈번호 추출)
git add .
git commit -m "[#145] fix: 찍볼 목록 무한스크롤 버그 수정"

# 5. 원격 저장소에 push
git push origin bugfix/#145_infinite-scroll-fix

# 6. PR 생성
# GitHub에서 main으로 PR 생성

# 7. 리뷰 후 병합
# 리뷰 완료 후 main에 병합
```


## 자주 사용하는 Git 명령어

### 기본 명령어
```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 스테이징된 변경사항 확인
git diff --staged

# 커밋 히스토리 확인
git log --oneline --graph

# 원격 브랜치와 동기화
git fetch origin

# 브랜치 목록 확인
git branch -a
```

### 문제 해결 명령어
```bash
# 마지막 커밋 수정
git commit --amend

# 변경사항 되돌리기 (스테이징 전)
git checkout -- 파일명

# 스테이징 취소
git reset HEAD 파일명

# 커밋 되돌리기
git revert 커밋해시

# 강제 푸시 (주의!)
git push --force-with-lease
```

## 트러블슈팅

### 자주 발생하는 문제들

#### 병합 충돌 해결
```bash
# 1. 충돌 발생한 파일 확인
git status

# 2. 파일 열어서 충돌 부분 수정
# <<<<<<< HEAD
# 현재 브랜치 내용
# =======
# 머지하려는 브랜치 내용  
# >>>>>>> branch-name

# 3. 수정 완료 후 스테이징
git add 충돌파일명

# 4. 테스트 실행 및 확인
npm test
npm run lint
npm run type-check

# 5. 테스트 통과 후 머지 완료
git commit
```

#### 실수로 잘못된 브랜치에 커밋한 경우
```bash
# 1. 새로운 올바른 브랜치 생성
git checkout -b correct-branch

# 2. 잘못된 브랜치로 이동
git checkout wrong-branch

# 3. 마지막 커밋 취소 (변경사항은 보존)
git reset --soft HEAD~1

# 4. 올바른 브랜치로 이동하여 커밋
git checkout correct-branch
git add .

# 5. 테스트 실행 및 확인
npm test
npm run lint
npm run type-check

# 6. 테스트 통과 후 커밋
git commit -m "올바른 브랜치에 커밋"
```

#### 코드 변경 후 테스트 실패 시
```bash
# 1. 실패한 테스트 확인
npm test

# 2. 특정 테스트만 실행 (디버깅)
npm test -- --testNamePattern="테스트명"

# 3. 린트 오류 확인 및 수정
npm run lint
npm run lint:fix

# 4. 타입 오류 확인 및 수정
npm run type-check

# 5. 모든 검사 통과 후 커밋
git add .
git commit -m "[#이슈번호] fix: 테스트 오류 수정"
```