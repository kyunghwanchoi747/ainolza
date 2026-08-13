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

## 디자인 룰 (반드시 준수)
홈페이지 전체 윤곽은 이미 잡혀 있음. 새로 만들지 말고 **기존을 최대한 재활용**할 것.

### 톤
- **AI스럽거나 자극적인 색감 금지**: 무지개 그라데이션·네온·파스텔 도배·비비드 멀티컬러 모두 금지
- **이모지 금지**: 🏦 ⚠️ ★ ✓ 🎓 💡 🔥 📅 ⚡ 📦 🎁 같은 이모지는 UI 텍스트에 넣지 말 것. 텍스트만으로 의미 전달
- **컬러 팔레트 제한**: `ink` `sub` `line` `surface` `brand`(코랄)만 사용을 기본으로. 빨강·파랑·노랑·주황 배경 박스 만들지 말 것. 강조는 ink 진하게 또는 brand 한 가지로
- **box 강조 최소화**: 형형색색 배경 박스 대신 `border-t` `border-b` 등 라인 구분 선호
- "심플 + 색감 적당히 섞은 센스 있는" 톤 유지

### 재사용 원칙
- **새 컴포넌트 만들기 전에 [src/components/design-system/](src/components/design-system/) 폴더 먼저 확인**
- 같은 시각 톤의 부품이 이미 있으면 그것 사용. 없으면 그 폴더에 추가하고 다른 곳에서도 같이 활용 가능하게 정리
- 페이지마다 다른 톤의 버튼·박스 만들지 말 것. 같은 액션은 같은 컴포넌트로

### 디자인 시스템 부품 (현재 등록된 것)
- [src/components/design-system/buttons.tsx](src/components/design-system/buttons.tsx)
  - `<PrimaryButtonCard>` — 흰 배경 + 부드러운 이중 그림자. 1순위 행동(수강 신청 등)
  - `<KakaoButton>` — 카카오 노랑 + K 마크. 카카오톡 문의
  - `<OutlineButton>` — 회색 보더. 보조 액션

## 새 상품 등록 절차 (반드시 이 순서로만 진행)

> 상품 상세페이지에 커스텀 디자인(스크롤 연출 등)이 필요할 때의 표준 절차.
> 이 섹션에 없는 방식(예: `store/[slug]/page.tsx`에 새 `product.slug === '...'` 분기 직접 추가)은 **금지**.
> 이유: 그 파일은 모든 상품이 공유하는 공용 라우트라, 상품마다 조건문을 추가하면
> 다른 상품 렌더링까지 깨뜨릴 위험이 계속 누적됨. 반드시 아래 레지스트리 방식만 사용할 것.

### 0. 선행 조건 확인
`src/components/store/custom-detail-registry.tsx` 파일이 있는지 먼저 확인.
- **없으면**: 먼저 이 파일을 만들고, `store/[slug]/page.tsx`에 흩어진 상품별 하드코딩 분기(현재 `vibe-coding-101-vod` 조건들)를 레지스트리 참조로 교체하는 1회성 리팩터링부터 수행. 완료 후 기존 상품(VOD 등) 페이지가 리팩터링 전과 동일하게 뜨는지 브라우저로 반드시 확인.
- **있으면**: 아래 1~2단계만 수행.

### 커스텀 디자인이 필요한 경우 (코드 작업)
1. `src/components/store/{상품명}-detail-content.tsx` 새 컴포넌트 작성 (디자인 이식)
2. `custom-detail-registry.tsx`에 `slug → 컴포넌트` 한 줄 추가
3. 로컬 서버로 새 상품 페이지만 브라우저 확인 (다른 상품 페이지는 안 건드렸으므로 재확인 불필요)
4. git 커밋 (사용자 승인 후) → 배포

### 표준 템플릿으로 충분한 경우
admin의 이미지 나열 + 버튼 템플릿으로 충분하면 코드 작업 자체가 불필요 — 바로 아래 admin 단계로.

### admin에서 사용자가 할 일 (코드 배포 후, 매 상품 공통)
5. **Products 컬렉션**에 상품 row 추가
   - `slug`, `title`, `price`, `productType`(class/ebook/book/bundle) 필수
   - 가격 옵션이 여러 개면(정본/기본형 등) **옵션별로 row를 각각 등록** (한 상품 row = 가격 1개)
   - 실물 배송이 있으면 `requiresShipping: true` (결제 페이지에 배송지 입력 폼 자동 노출)
   - 강의실 입장 권한이 필요 없으면 `grantedClassroomSlugs`는 비워둠 (자동 스킵, 별도 처리 불필요)
   - `actions` 버튼에 `/checkout?slug={상품slug}` 연결
6. **`/store` 목록 노출 여부 결정** — 커스텀 코드 페이지로 연결하려면 `store/page.tsx`의 `EXTERNAL_LINK_OVERRIDE`에 매핑 한 줄 추가 (기존 `online-business-class` 패턴과 동일)
7. **테스트 결제 1건**으로 이메일 문구(배송/강의실 안내가 `productType` 기준으로 자동 분기됨)와 배송지 폼이 맞게 뜨는지 확인

### 절대 하지 말 것
- `store/[slug]/page.tsx`, `checkout/page.tsx`, `Orders.ts` 훅에 상품별 `if (slug === ...)` 분기를 직접 추가하는 것 — 레지스트리로만 확장
- `payload generate:importmap` 로컬 재생성 (R2 핸들러 누락으로 운영 admin 깨짐, 과거 2회 실사고)

## 주의사항
- 로컬 개발: `@payloadcms/db-sqlite` + `file:./dev.db` 사용
- 프로덕션 배포: `@payloadcms/db-d1-sqlite`로 전환 필요
- dev.db는 .gitignore에 추가 필요
- R2 환경변수(R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)는 배포 시 설정 필요
- git safe.directory 설정 필요: 'C:/Users/USER/Desktop/_개발프로젝트/AI놀자 홈페이지 이전'
