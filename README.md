# 내 지식 카페 (Neaver Cafe 스타일 플랫폼)

## 프로젝트 개요
- 나만의 인사이트/칼럼 작성 및 공개
- 프로그램(파일) 배포 (구매자 전용 다운로드)
- 강의 판매 + 구매자 전용 영상 시청 (Cloudflare Stream)
- 회원들끼리 소통하는 커뮤니티 공간 (게시판, 댓글, 좋아요)
- 멤버십 기반 지식 공유 플랫폼 (네이버 카페 느낌)

기술 스택: Cloudflare Pages + Workers + D1 + R2 + Stream + Payload CMS + 아임포트 결제

## 바이브코딩 로드맵 (항상 이 순서 지키기)

1. Payload CMS + Cloudflare D1 템플릿 deploy
   - npx create-payload-app@latest . --template with-cloudflare-d1

2. Collection 세팅 (관리자 대시보드)
   - Posts (칼럼/인사이트)
   - Programs (파일 배포, R2)
   - Courses (강의, Stream 영상)
   - CommunityPosts (커뮤니티 게시판)

- [x] Access Control & 인증
   - 구매자만 영상/파일 접근 가능 (JWT + signed URL)
   - Orders 컬렉션 추가 완료 

4. 결제 연동
   - 아임포트 (국내 PG + PayPal 해외)
   - webhook → Workers에서 구매 상태 업데이트

5. 영상 & 파일 보호
   - Cloudflare Stream signed URL (24시간 유효)
   - R2 presigned URL (프로그램 다운로드)

6. 커뮤니티 기능
   - 댓글, 좋아요, 알림 (D1 기반)

7. SES 메일 트리거
   - 구매 완료, 새 칼럼 알림

8. 프론트 UI (Pages)
   - 홈, 칼럼 목록, 커뮤니티, 내 구매/강의 페이지

9. 배포 & 도메인 전환
   - wrangler pages deploy
   - wrangler deploy
   - 가비아 CNAME → Pages.dev 도메인

10. 테스트 & 롤아웃
    - 로컬: npm run dev + wrangler dev
    - 전환 후 301 리다이렉트 설정

## AI 도구 사용 전략
- Gemini CLI: 80% (프로젝트 생성, 코드 뚝딱)
- Claude Code: 15% (세밀 로직, 보안, 최적화)
- Grok CLI: 5% (vibe 아이디어, 빠른 프로토타입)

## 다음 할 일 (오늘 체크리스트)
- [x] Payload CMS deploy 완료
- [x] 첫 칼럼 Collection 만들기
- [ ] 관리자 대시보드 접속 테스트 (/admin)

막히면 Gemini 먼저 물어보고, 세밀한 건 Claude로!
