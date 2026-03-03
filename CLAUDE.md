# AI놀자 홈페이지 프로젝트

## 프로젝트 개요
아임웹에서 자체 호스팅으로 홈페이지 이전하는 프로젝트.
외부 서비스 의존 없이, 무료로, Cloudflare에서 운영하는 것이 목표.

## 핵심 결정사항
- **외부 서비스 사용 안 함** (Sanity, Webstudio 등 NO)
- **유료 서비스 사용 안 함**
- **코드로 디자인 조절하는 방식은 비효율적** → 시각적 편집기 필요
- Frappe Builder 같은 드래그앤드롭 페이지 빌더를 JS로 직접 만들어서 Cloudflare에서 운영

## 기술 스택
| 역할 | 기술 | 비용 |
|------|------|------|
| 시각적 편집기 | GrapeJS (오픈소스) | 무료 |
| 프레임워크 | Next.js 15.4.11 | 무료 |
| CMS/API | Payload CMS 3.76.1 | 무료 |
| DB (로컬 개발) | SQLite (file:./dev.db) | 무료 |
| DB (프로덕션) | Cloudflare D1 | 무료 |
| 이미지 저장 | Cloudflare R2 | 무료 (10GB) |
| 호스팅/배포 | Cloudflare Pages + OpenNext | 무료 |

## 단축 명령어
사용자가 아래 단어를 입력하면 해당 작업을 실행할 것:

- **"빌더시작"** → 페이지 빌더 구축 작업 시작
- **"현재상황"** → 프로젝트 진행 상황 요약 보고
- **"브라우저"** → 개발 서버 실행 + 브라우저 열기
- **"커밋"** → 현재 변경사항 커밋
- **"배포"** → Cloudflare에 배포
- **"서비스화"** → 멀티유저/멀티테넌트 기능 추가 (SaaS 확장)

## 주의사항
- 로컬 개발: `@payloadcms/db-sqlite` + `file:./dev.db` 사용
- 프로덕션 배포: `@payloadcms/db-d1-sqlite`로 전환 필요
- dev.db는 .gitignore에 추가 필요
- R2 환경변수(R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)는 배포 시 설정 필요
- git safe.directory 설정 필요: 'C:/Users/USER/Desktop/_개발프로젝트/AI놀자 홈페이지 이전'
