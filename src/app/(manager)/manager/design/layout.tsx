// 디자인 모드는 전체 화면 오버레이로 렌더링됩니다
export default function DesignModeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#f4f7fa',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: '#1e293b',
      }}
    >
      {children}
    </div>
  )
}
