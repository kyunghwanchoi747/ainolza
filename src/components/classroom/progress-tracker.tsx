'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * VOD 진도율 추적.
 *
 * 환불 규정 산정의 근거가 되므로 시청 자동 감지가 아니라
 * 수강생이 각 회차 아래의 완료 버튼을 "직접" 눌러 기록하는 방식을 유지한다.
 *
 * 구성:
 *  - <ProgressProvider>  : 진도 데이터 1회 로드 + 완료 기록 API 호출 (페이지 전체를 감싼다)
 *  - <ProgressBar>       : 상단 진도 요약 (바 + 퍼센트)
 *  - <SessionCompleteButton> : 각 회차 영상 아래에 배치하는 수강 완료 버튼
 */

interface ProgressState {
  completedNumbers: number[]
  progressPercent: number
  loading: boolean
  marking: number | null
  totalSessions: number
  markComplete: (sessionNumber: number) => void
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
    async (sessionNumber: number) => {
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
        } else {
          let err: { error?: string } | null = null
          try {
            err = await res.json()
          } catch {
            // 응답 본문이 JSON이 아니면 기본 문구 사용
          }
          alert(err?.error || '완료 기록에 실패했습니다. 잠시 후 다시 시도해주세요.')
        }
      } catch (error) {
        console.error('회차 완료 기록 실패:', error)
        alert('완료 기록에 실패했습니다. 네트워크를 확인해주세요.')
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
        진도율은 각 회차 아래의 &lsquo;수강 완료&rsquo; 버튼을 직접 눌러 기록됩니다.
      </p>
    </div>
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
