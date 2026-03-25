# AI놀자 프로젝트 진행상황

## 현재 상태: 관리자 UI v2 완성 + 빌드 통과

관리자 패널이 아임웹/워드프레스급 UI로 리디자인 완료. 사이드바, 글로벌 검색, 다크모드, 토스트 알림 등 전문적인 관리 패널 기능 탑재.

---

## 완료된 작업

### 1. 프로젝트 기반 구성
- [x] ai-nolja 서브모듈에서 유용한 컴포넌트 복사 (header, footer, hero, utility, theme-provider)
- [x] Sanity 의존성 완전 제거
- [x] 루트 레이아웃 구성 (한국어, Pretendard 폰트, 다크모드)
- [x] 프론트엔드 레이아웃 (Header + Footer + ThemeProvider)
- [x] globals.css (Tailwind v4 + shadcn/ui 호환 테마 변수 + hsl() 래핑)

### 2. Payload CMS 컬렉션
- [x] Users 컬렉션 (admin/user 역할)
- [x] Media 컬렉션 (이미지 업로드)
- [x] DesignPages 컬렉션 (title, slug, projectData, html, css, status)

### 3. 데이터베이스 연결
- [x] 로컬 개발용 SQLite 어댑터 설정 (`@payloadcms/db-sqlite` + `file:./dev.db`)
- [x] DB 마이그레이션 자동 실행 확인
- [x] CRUD API 정상 작동 확인

### 4. GrapeJS 페이지 빌더 에디터
- [x] GrapesEditor 컴포넌트 (`src/components/manager/GrapesEditor.tsx`)
- [x] 커스텀 블록 8종: 히어로, 이미지 갤러리, 피처 카드, 텍스트, CTA 배너, 비디오, 구분선, 여백
- [x] 메타데이터 바: 제목, 슬러그, 발행 상태(임시저장/게시) 입력
- [x] 저장 시 title/slug/status + projectData/html/css 모두 API에 전송
- [x] 새 페이지 저장 후 URL 자동 갱신 (editor/new → editor/{id})
- [x] 기존 페이지 편집 시 메타데이터 + 에디터 데이터 모두 로드
- [x] 미리보기 링크, 목록 돌아가기 버튼
- [x] 토스트 알림 (alert → sonner 교체)

### 5. API 라우트
- [x] `GET /api/manager/pages` - 페이지 목록/단건 조회 (id 또는 slug)
- [x] `POST /api/manager/pages` - 새 페이지 생성
- [x] `PUT /api/manager/pages` - 기존 페이지 수정
- [x] `DELETE /api/manager/pages` - 페이지 삭제
- [x] `POST /api/manager/pages/upload` - 이미지 업로드 (Payload Media 컬렉션 경유)

### 6. 프론트엔드 렌더링
- [x] 홈페이지(`/`): slug='home' + status='published' 페이지를 DB에서 조회 → 렌더링
- [x] 홈페이지 없을 때: "페이지 빌더 열기" 안내 표시
- [x] 동적 페이지(`/p/[slug]`): 발행된 페이지 조회 → HTML/CSS 렌더링
- [x] CSS 스코핑 (`.gjs-rendered`로 감싸서 Tailwind 충돌 방지)

### 7. 관리자 UI v2 (NEW - 2026-03-03)
- [x] **shadcn/ui 기반 디자인 시스템** (Radix UI + Tailwind + CVA)
- [x] **공통 UI 컴포넌트** 10종: Button, Input, Badge, Card, Dialog, DropdownMenu, Command, Separator, Tooltip, ScrollArea
- [x] **사이드바 네비게이션** (접기/펼치기, 아이콘 모드, localStorage 상태 유지)
  - 대시보드, 페이지, 디자인 에디터, 상품(준비중), 주문(준비중), 회원(준비중), 통계(준비중), 설정(준비중)
  - 사이트 보기 외부 링크
- [x] **헤더 바** (검색, 알림, 테마 토글, 프로필 드롭다운)
- [x] **글로벌 검색 (Ctrl+K)** - cmdk 기반 커맨드 팔레트
  - 빠른 이동: 대시보드, 페이지 관리, 새 페이지
  - 페이지 목록 실시간 검색
  - 외부 링크: 사이트 보기, Payload 관리 패널
- [x] **다크/라이트/시스템 테마** (next-themes 기반, 드롭다운 메뉴)
- [x] **대시보드** - 통계 카드 (전체 페이지, 게시됨, 임시저장), 빠른 시작, 최근 페이지
- [x] **페이지 목록** - 테이블 뷰, 검색 필터, 상태 배지, 드롭다운 메뉴 (편집/미리보기/삭제)
- [x] **페이지 삭제** - DELETE API + 확인 다이얼로그 + 토스트 알림
- [x] **토스트 알림** (sonner) - 저장/삭제/에러 시 우하단 알림
- [x] **에디터 풀스크린** - 별도 라우트 그룹 `(editor)`로 분리 (사이드바 없음)

### 8. Payload 관리자 패널
- [x] `/admin` 경로로 Payload CMS 관리 패널 접근 가능
- [x] importMap 생성 완료

### 9. 빌드/설정 개선
- [x] dev.db를 .gitignore에 추가
- [x] 중첩된 AI놀자 홈페이지 이전 디렉토리를 tsconfig exclude에 추가
- [x] globals.css를 Tailwind v4 + shadcn/ui 호환으로 업데이트 (hsl() 래핑)

---

## 미완료 작업 (앞으로 해야 할 일)

### 우선순위 높음

#### 1. 이미지 업로드 기능 완성
- [ ] 로컬 개발 환경에서 이미지 업로드 테스트 (R2 없이 로컬 저장)
- [ ] R2 환경변수 설정 (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)
- [ ] GrapeJS 에디터 내 이미지 업로드 → R2 저장 → URL 반환 흐름 확인

#### 2. Cloudflare 배포
- [ ] `payload.config.ts`를 프로덕션 용으로 전환 (sqliteD1Adapter 사용)
  - 환경변수로 분기하거나, 빌드 시 설정 파일 교체
- [ ] DB 마이그레이션 실행 (`pnpm run deploy:database`)
- [ ] `pnpm run deploy:app`으로 Cloudflare Pages 배포
- [ ] 배포 후 실제 도메인에서 동작 확인

### 우선순위 중간

#### 3. 에디터 UX 개선
- [ ] 모바일 반응형 편집 미리보기
- [ ] 블록 추가 시 카테고리별 정리 개선
- [ ] Undo/Redo 단축키 안내
- [ ] 자동 저장 기능 (일정 간격으로)
- [ ] 페이지 복제 기능

#### 4. 프론트엔드 네비게이션 연동
- [ ] 헤더 메뉴를 DB 기반으로 변경 (현재 하드코딩)
- [ ] 빌더에서 만든 페이지가 메뉴에 자동으로 나타나도록
- [ ] 메뉴 순서/구조 관리 기능

#### 5. SEO 기능
- [ ] 각 페이지에 메타 타이틀/설명 필드 추가
- [ ] OG 이미지 설정
- [ ] sitemap.xml 자동 생성

#### 6. 사용자 인증
- [ ] 관리자 로그인 기능 (현재 누구나 /manager 접근 가능)
- [ ] Payload Users 컬렉션과 연동
- [ ] 세션/토큰 기반 인증

### 우선순위 낮음

#### 7. 상품/주문 관리 (스토어)
- [ ] 상품 컬렉션 생성
- [ ] 주문 컬렉션 생성
- [ ] 상품 목록/상세 페이지
- [ ] 장바구니/결제 흐름

#### 8. 추가 기능
- [ ] 커뮤니티 페이지
- [ ] 강의/튜토리얼 페이지
- [ ] 방문자 통계

#### 9. 서비스화 (SaaS 확장)
- [ ] 멀티테넌트 구조 설계
- [ ] 사용자별 독립 사이트 생성
- [ ] 커스텀 도메인 연결

---

## 프로젝트 파일 구조

```
src/
├── payload.config.ts              # Payload 설정 (로컬: SQLite / 배포: D1)
├── collections/
│   ├── Users.ts                   # 사용자 컬렉션
│   ├── Media.ts                   # 미디어 컬렉션
│   └── DesignPages.ts             # 페이지 빌더 데이터
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── globals.css                # Tailwind v4 + shadcn/ui 테마
│   ├── (frontend)/
│   │   ├── layout.tsx             # 프론트엔드 레이아웃 (Header/Footer)
│   │   ├── page.tsx               # 홈페이지 (DB에서 slug='home' 로드)
│   │   └── p/[slug]/page.tsx      # 동적 페이지 렌더링
│   ├── (manager)/
│   │   ├── layout.tsx             # 관리자 레이아웃 (사이드바 + 헤더 + ThemeProvider)
│   │   └── manager/
│   │       ├── page.tsx           # 대시보드 (통계 + 빠른 시작 + 최근 페이지)
│   │       └── design/
│   │           └── page.tsx       # 페이지 목록 (테이블 + 검색 + 삭제)
│   ├── (editor)/
│   │   ├── layout.tsx             # 에디터 레이아웃 (풀스크린)
│   │   └── manager/design/editor/[id]/
│   │       └── page.tsx           # GrapeJS 에디터
│   ├── (payload)/                 # Payload CMS admin (/admin)
│   └── api/manager/pages/
│       ├── route.ts               # 페이지 CRUD + DELETE
│       └── upload/route.ts        # 이미지 업로드
├── components/
│   ├── ui/                        # shadcn/ui 기반 공통 컴포넌트
│   │   ├── button.tsx             # 버튼 (variant: default/destructive/outline/secondary/ghost/link)
│   │   ├── input.tsx              # 입력 필드
│   │   ├── badge.tsx              # 배지 (success/warning/destructive 등)
│   │   ├── card.tsx               # 카드
│   │   ├── dialog.tsx             # 다이얼로그/모달
│   │   ├── dropdown-menu.tsx      # 드롭다운 메뉴
│   │   ├── command.tsx            # 커맨드 팔레트 (cmdk)
│   │   ├── separator.tsx          # 구분선
│   │   ├── tooltip.tsx            # 툴팁
│   │   └── scroll-area.tsx        # 스크롤 영역
│   ├── manager/
│   │   ├── manager-shell.tsx      # 관리자 셸 (사이드바 + 헤더 + Toaster + Cmd+K)
│   │   ├── sidebar.tsx            # 사이드바 (접기/펼치기, 네비게이션)
│   │   ├── manager-header.tsx     # 헤더 (검색, 테마, 프로필)
│   │   ├── command-search.tsx     # 글로벌 검색 (Ctrl+K 커맨드 팔레트)
│   │   └── GrapesEditor.tsx       # GrapeJS 에디터 컴포넌트
│   ├── layout/header.tsx          # 프론트엔드 네비게이션 헤더
│   ├── layout/site-footer.tsx     # 푸터
│   ├── home/hero-section.tsx      # 히어로 (레거시, DB 전환 예정)
│   ├── home/utility-section.tsx   # 유틸리티 (레거시, DB 전환 예정)
│   └── theme-provider.tsx         # 다크/라이트 모드
└── lib/utils.ts                   # cn() 유틸리티
```

---

## 기술 스택

| 역할 | 기술 | 비용 |
|------|------|------|
| 시각적 편집기 | GrapeJS (오픈소스) | 무료 |
| 프레임워크 | Next.js 15.4.11 | 무료 |
| CMS/API | Payload CMS 3.76.1 | 무료 |
| UI 컴포넌트 | shadcn/ui (Radix + Tailwind + CVA) | 무료 |
| 커맨드 팔레트 | cmdk | 무료 |
| 토스트 알림 | sonner | 무료 |
| 아이콘 | lucide-react | 무료 |
| DB (로컬) | SQLite (file:./dev.db) | 무료 |
| DB (프로덕션) | Cloudflare D1 | 무료 |
| 이미지 저장 | Cloudflare R2 | 무료 (10GB) |
| 호스팅/배포 | Cloudflare Pages + OpenNext | 무료 |

---

## 개발 명령어

```bash
# 로컬 개발 서버
npm run dev -- -p 3001

# 빌드
npm run build

# Cloudflare 배포 (프로덕션)
pnpm run deploy

# Payload import map 생성
npm run generate:importmap

# Payload 타입 생성
npm run generate:types:payload
```

---

*마지막 업데이트: 2026-03-03*
