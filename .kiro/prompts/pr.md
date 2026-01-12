---
activation_phrase: "{{ 브랜치이름 }} PR description 만들어줘"
inclusion: on_match
---

# PR Description 생성

사용자가 "{{ 브랜치이름 }} PR description 만들어줘" 라고 요청하면:

## 1. 변경사항 확인
```bash
git diff {{ 브랜치이름 }}...HEAD
```

현재 브랜치에서 {{ 브랜치이름 }}으로 머지할 때 포함되는 변경사항 확인

## 2. 커밋 목록 확인
```bash
git log {{ 브랜치이름 }}..HEAD --oneline
```

## 3. PR Description 생성

다음 형식으로 PR description 작성:

```markdown
## 📋 개요
[변경사항 요약 - 1~2문장]

## 🎯 주요 변경사항
- [변경사항 1]
- [변경사항 2]
- [변경사항 3]

## 🔗 관련 이슈
- Closes [SCRUM-XXXXX]
```

## 4. 출력
- 복사 가능한 마크다운 형식으로 제공
- 커밋 메시지에서 일감번호 자동 추출하여 `Closes [일감번호]` 형식으로 작성
