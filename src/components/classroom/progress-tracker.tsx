'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * VOD 진도율 추적.
 *
 * 기본은 자동 기록: Vimeo 영상을 90% 이상 시청하면 자동으로 수강 완료 기록.
 * (기록 시각이 남으므로 환불 규정 산정 근거로 사용 — 클래스101/인프런과 동일 방식)
 * 수동 완료 버튼은 보조 수단으로 유지 (유튜브 라이브 회차, 자동 기록 실패 대비).
 *
 * 구성:
 *  - <ProgressProvider>  : 진도 데이터 1회 로드 + 완료 기록 API 호출 (페이지 전체를 감싼다)
 *  - <ProgressBar>       : 상단 진도 요약 (바 + 퍼센트)
 *  - <VimeoTrackedPlayer>: 시청 진행률을 감지해 자동 기록하는 Vimeo 플레이어
 *  - <SessionCompleteButton> : 각 회차 아래 수동 완료 버튼 (보조)
 */

interface ProgressState {
  completedNumbers: number[]
  progressPercent: number
  loading: boolean
  marking: number | null
  totalSessions: number
  /** silent=true면 실패해도 알림창을 띄우지 않음 (자동 기록용). 성공 여부 반환 */
  markComplete: (sessionNumber: number, silent?: boolean) => Promise<boolean>
}

const ProgressContext = createContext<ProgressState | null>(null)

export function ProgressProvider({
  classroomId,
  totalSessions,
  children,
}: {
  classroomId: string | number
  totalSessions: number
  children: ReactNode
}) {
  const [completedNumbers, setCompletedNumbers] = useState<number[]>([])
  const [progressPercent, setProgressPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState<number | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/classroom-progress', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json() as { progress: any[] }
          const mine = data.progress.find(
            (p: any) =>
              String(p.classroom) === String(classroomId) ||
              (typeof p.classroom === 'object' && p.classroom?.id === classroomId),
          )
          if (mine) {
            setCompletedNumbers((mine.completedSessions ?? []).map((s: any) => s.sessionNumber))
            setProgressPercent(mine.progressPercent ?? 0)
          }
        }
      } catch (error) {
        console.error('진도 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [classroomId])

  const markComplete = useCallback(
    async (sessionNumber: number, silent = false): Promise<boolean> => {
      setMarking(sessionNumber)
      try {
        const res = await fetch('/api/classroom-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ classroomId, sessionNumber }),
        })
        if (res.ok) {
          const updated = await res.json() as {
            progressPercent: number
            completedSessions: Array<{ sessionNumber: number }>
          }
          setCompletedNumbers((updated.completedSessions ?? []).map((s) => s.sessionNumber))
          setProgressPercent(updated.progressPercent ?? 0)
          return true
        }
        let err: { error?: string } | null = null
        try {
          err = await res.json()
        } catch {
          // 응답 본문이 JSON이 아니면 기본 문구 사용
        }
        if (!silent) alert(err?.error || '완료 기록에 실패했습니다. 잠시 후 다시 시도해주세요.')
        return false
      } catch (error) {
        console.error('회차 완료 기록 실패:', error)
        if (!silent) alert('완료 기록에 실패했습니다. 네트워크를 확인해주세요.')
        return false
      } finally {
        setMarking(null)
      }
    },
    [classroomId],
  )

  return (
    <ProgressContext.Provider
      value={{ completedNumbers, progressPercent, loading, marking, totalSessions, markComplete }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

/** 상단 진도 요약 바 */
export function ProgressBar() {
  const ctx = useContext(ProgressContext)
  if (!ctx || ctx.loading) return <div className="h-14" />

  const { progressPercent, completedNumbers, totalSessions } = ctx

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-ink">학습 진도</h3>
        <span className="text-sm font-bold text-brand">
          {progressPercent}% ({completedNumbers.length}/{totalSessions})
        </span>
      </div>
      <div className="w-full h-3 bg-line rounded-full overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-sub pt-1">
        영상을 90% 이상 시청하면 자동으로 수강 완료가 기록됩니다. 각 회차 아래 버튼으로 직접 체크할 수도 있습니다.
      </p>
    </div>
  )
}

/**
 * 시청 진행률 자동 감지 Vimeo 플레이어.
 * 90% 이상 시청(또는 끝까지 재생) 시 자동으로 수강 완료를 기록한다.
 */
export function VimeoTrackedPlayer({
  vimeoId,
  sessionNumber,
  title,
}: {
  vimeoId: string
  sessionNumber: number
  title: string
}) {
  const ctx = useContext(ProgressContext)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const firedRef = useRef(false)
  // 최신 상태를 이벤트 콜백에서 참조하기 위한 ref (플레이어 리스너는 마운트 시 1회만 등록)
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let player: any = null
    let cancelled = false

    // SDK 동적 로드 — 초기 번들 크기 영향 최소화
    import('@vimeo/player').then(({ default: Player }) => {
      if (cancelled || !iframeRef.current) return
      player = new Player(iframeRef.current)

      const complete = async () => {
        const c = ctxRef.current
        if (firedRef.current || !c) return
        if (c.completedNumbers.includes(sessionNumber)) return
        firedRef.current = true
        const ok = await c.markComplete(sessionNumber, true)
        // 네트워크 오류 등으로 실패하면 다음 timeupdate에서 재시도
        if (!ok) firedRef.current = false
      }

      player.on('timeupdate', (data: { percent: number }) => {
        if (data.percent >= 0.9) complete()
      })
      player.on('ended', complete)
    }).catch((err: unknown) => {
      console.error('Vimeo 플레이어 초기화 실패:', err)
    })

    return () => {
      cancelled = true
      if (player) {
        try {
          player.off('timeupdate')
          player.off('ended')
        } catch {
          // 플레이어가 이미 해제된 경우 무시
        }
      }
    }
  }, [sessionNumber])

  return (
    <iframe
      ref={iframeRef}
      src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      title={title}
      className="absolute inset-0 w-full h-full"
    />
  )
}

/** 각 회차 영상 아래에 배치하는 수강 완료 버튼 */
export function SessionCompleteButton({
  sessionNumber,
  weekLabel,
}: {
  sessionNumber: number
  weekLabel?: string | number
}) {
  const ctx = useContext(ProgressContext)
  if (!ctx || ctx.loading) return null

  const { completedNumbers, marking, markComplete } = ctx
  const isCompleted = completedNumbers.includes(sessionNumber)
  const isMarking = marking === sessionNumber
  const label = weekLabel !== undefined && weekLabel !== null ? `${weekLabel}회차` : '이 회차'

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-light border border-[#D4756E] text-brand text-sm font-bold">
        {label} 수강 완료
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => markComplete(sessionNumber)}
      disabled={isMarking}
      className={`px-5 py-2.5 rounded-full border border-line text-sm font-bold transition-colors ${
        isMarking
          ? 'text-sub cursor-wait'
          : 'text-body hover:border-[#D4756E] hover:text-brand cursor-pointer'
      }`}
    >
      {isMarking ? '기록 중…' : `${label} 수강 완료 체크`}
    </button>
  )
}
