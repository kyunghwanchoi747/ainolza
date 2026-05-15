/**
 * 이키가이 4원 다이어그램.
 *
 * 자극적 그라데이션 대신 단색 라인 + 옅은 면. ink/sub/line/brand 팔레트만 사용.
 * 4축 답변이 있으면 각 원 안쪽에 키워드를 배치, 한가운데 교차점에는 AI가 뽑은
 * 핵심 키워드를 표시.
 */

type Props = {
  showLabels?: boolean
  loveItems?: string[]
  goodAtItems?: string[]
  worldItems?: string[]
  paidItems?: string[]
  centerKeywords?: string[]
}

export function IkigaiDiagram({
  showLabels = false,
  loveItems = [],
  goodAtItems = [],
  worldItems = [],
  paidItems = [],
  centerKeywords = [],
}: Props) {
  // viewBox 좌표 — 4원은 정사각형 안 +/+−/−+/−− 위치로 배치
  // 각 원 반지름 130, 중심간 거리 130*1.05 정도면 가운데 교집합이 보기 좋게 생김
  const R = 130
  const O = 95 // 중심에서 각 원 중심까지 거리

  // 4원 중심 좌표
  const C_LOVE   = { x: -O, y: -O } // 좌상 — 좋아하는 것
  const C_GOOD   = { x:  O, y: -O } // 우상 — 잘하는 것
  const C_PAID   = { x:  O, y:  O } // 우하 — 돈
  const C_WORLD  = { x: -O, y:  O } // 좌하 — 세상이 필요로 하는 것

  return (
    <div className="w-full">
      <svg
        viewBox="-260 -260 520 520"
        className="w-full max-w-md mx-auto"
        role="img"
        aria-label="이키가이 4원 다이어그램"
      >
        {/* 4원 (옅은 면 + 진한 라인) */}
        <circle cx={C_LOVE.x} cy={C_LOVE.y} r={R} fill="#1a1a1a" fillOpacity="0.04" stroke="#1a1a1a" strokeWidth="1.2" />
        <circle cx={C_GOOD.x} cy={C_GOOD.y} r={R} fill="#1a1a1a" fillOpacity="0.04" stroke="#1a1a1a" strokeWidth="1.2" />
        <circle cx={C_PAID.x} cy={C_PAID.y} r={R} fill="#1a1a1a" fillOpacity="0.04" stroke="#1a1a1a" strokeWidth="1.2" />
        <circle cx={C_WORLD.x} cy={C_WORLD.y} r={R} fill="#1a1a1a" fillOpacity="0.04" stroke="#1a1a1a" strokeWidth="1.2" />

        {/* 가운데 4원 교집합 — brand 색으로 살짝 강조 */}
        <circle cx="0" cy="0" r="40" fill="#FFF1F0" stroke="#D4756E" strokeWidth="1.2" />

        {/* 축 라벨 (4 코너) */}
        {showLabels && (
          <>
            <AxisLabel x={C_LOVE.x}  y={C_LOVE.y - R - 14}  text="좋아하는 것" />
            <AxisLabel x={C_GOOD.x}  y={C_GOOD.y - R - 14}  text="잘하는 것" />
            <AxisLabel x={C_WORLD.x} y={C_WORLD.y + R + 22} text="세상이 필요로 하는 것" />
            <AxisLabel x={C_PAID.x}  y={C_PAID.y + R + 22}  text="돈으로 연결되는 것" />
          </>
        )}

        {/* 2-교집합 라벨 (4변 가운데) */}
        {showLabels && (
          <>
            {/* love ∩ good = 열정 — 위쪽 가운데 */}
            <IntersectionLabel x={0} y={-O} text="열정" />
            {/* good ∩ paid = 직업 — 오른쪽 가운데 */}
            <IntersectionLabel x={O} y={0} text="직업" />
            {/* paid ∩ world = 천직 — 아래쪽 가운데 */}
            <IntersectionLabel x={0} y={O} text="천직" />
            {/* world ∩ love = 사명 — 왼쪽 가운데 */}
            <IntersectionLabel x={-O} y={0} text="사명" />
          </>
        )}

        {/* 가운데 키워드 — AI 결과지일 때만 */}
        {centerKeywords.length > 0 && (
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#D4756E"
          >
            IKIGAI
          </text>
        )}

        {/* 각 원 내부에 사용자 답변 키워드 배치 */}
        {loveItems.length > 0 && (
          <AxisItems items={loveItems.slice(0, 3)} cx={C_LOVE.x}  cy={C_LOVE.y}  />
        )}
        {goodAtItems.length > 0 && (
          <AxisItems items={goodAtItems.slice(0, 3)} cx={C_GOOD.x}  cy={C_GOOD.y}  />
        )}
        {worldItems.length > 0 && (
          <AxisItems items={worldItems.slice(0, 3)} cx={C_WORLD.x} cy={C_WORLD.y} />
        )}
        {paidItems.length > 0 && (
          <AxisItems items={paidItems.slice(0, 1)} cx={C_PAID.x} cy={C_PAID.y} maxChars={14} />
        )}
      </svg>
    </div>
  )
}

function AxisLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="13"
      fontWeight="600"
      fill="#1a1a1a"
      letterSpacing="-0.3"
    >
      {text}
    </text>
  )
}

function IntersectionLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      fontSize="10"
      fontWeight="500"
      fill="#888888"
    >
      {text}
    </text>
  )
}

/**
 * 각 원 내부에 키워드를 세로로 쌓아서 표시.
 * 너무 길면 잘라낸다.
 */
function AxisItems({
  items,
  cx,
  cy,
  maxChars = 8,
}: {
  items: string[]
  cx: number
  cy: number
  maxChars?: number
}) {
  // 원 안쪽 중간 영역에 세 줄 배치 — 가운데 교집합과 안 겹치게 살짝 바깥쪽으로
  const offsetX = cx < 0 ? -28 : 28
  const offsetY = cy < 0 ? -10 : 10
  const baseX = cx + offsetX * 0
  const baseY = cy + offsetY * 0
  const lineHeight = 14

  return (
    <>
      {items.map((it, i) => {
        const short = it.length > maxChars ? it.slice(0, maxChars) + '…' : it
        return (
          <text
            key={i}
            x={baseX}
            y={baseY + (i - (items.length - 1) / 2) * lineHeight + 4}
            textAnchor="middle"
            fontSize="10.5"
            fill="#1a1a1a"
            fillOpacity="0.7"
          >
            {short}
          </text>
        )
      })}
    </>
  )
}
