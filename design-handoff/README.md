# design-handoff

claude.ai/design 에서 받은 시안 핸드오프 코드/zip 작업 폴더.

## 사용법

1. claude.ai/design 에서 **Handoff to Claude Code** 또는 **Download project as .zip** 받음
2. 받은 zip을 이 폴더에 풀거나, 코드를 하위 폴더로 정리해 둠
   ```
   design-handoff/
     checkout-v2/      ← 결제 페이지 새 시안
     store-detail-v2/  ← 상품 상세 새 시안
     ...
   ```
3. Claude에게 "design-handoff/checkout-v2 시안 적용해줘" 요청
4. 적용 완료 후 더 이상 필요 없으면 해당 하위 폴더 삭제

## git

- 이 폴더 내용은 `.gitignore` 처리됨 (README.md 제외)
- 핸드오프 원본은 커밋하지 않음. 변환된 결과 코드(`src/...`)만 커밋됨

## 주의

시안에 포함된 비밀 키 / 토큰 / 개인정보가 없는지 확인 후 작업.
