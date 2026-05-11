# AI놀자 디자인 시스템

페이지마다 다른 톤으로 흩어지지 않게, 재사용 가능한 부품을 모아두는 폴더.

## 사용 원칙

1. 새 페이지/시안 작업 시 **이 폴더 먼저 import 시도**. 없는 부품만 새로 추출.
2. 추출한 부품은 반드시 여기에 두고 이 README 업데이트.
3. **AI스러운 색감·이모지 금지**. 컬러는 `ink`/`sub`/`line`/`surface`/`brand` 위주.
4. 같은 액션은 같은 컴포넌트로. 페이지마다 따로 짜지 말 것.

## 등록된 부품

### `buttons.tsx`

```tsx
import { PrimaryButtonCard, KakaoButton, OutlineButton } from '@/components/design-system/buttons'

// 1순위 행동 — 흰 배경 + 보더 없음 + 부드러운 이중 그림자
<PrimaryButtonCard href="/checkout?slug=vibe-coding-101">
  수강 신청하기 →
</PrimaryButtonCard>

// 카카오톡 문의
<KakaoButton href="https://open.kakao.com/o/s7kkWTfh">
  카카오톡으로 문의하기
</KakaoButton>

// 보조 액션
<OutlineButton href="/some-link">
  입문 강의 보러가기 →
</OutlineButton>
```

## 추가 후보 (시안 들어오면 추출)

- `<EyebrowLabel>` — 카테고리 캡스 라벨 (brand색 + 트래킹)
- `<StageBadge>` — 슈퍼얼리버드 알약 (옅은 분홍 보더 + 윗변 빨강 강조)
- `<PriceBox>` — 단계 라벨 + 할인율 + 큰 가격 + strike + 카운트다운 슬롯
- `<ServiceInfoBox>` — 회색 안내 박스 (제목 + 본문)
- `<HeroBackLink>` — 굵은 검정 백 링크
