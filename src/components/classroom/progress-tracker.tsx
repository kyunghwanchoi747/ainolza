'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface ProgressTrackerProps {
  classroomId: string | number
  totalSessions: number
}

interface Progress {
  progressPercent: number
  completedSessions: Array<{ sessionNumber: number; completedAt: string }>
}

export function ProgressTracker({ classroomId, totalSessions }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState<number | null>(null)

  // 초기 로드: 진도 데이터 조회
  useEffect(() => {
    fetchProgress()
  }, [classroomId])

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/classroom-progress', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json() as { progress: any[] }
        const classroomProgress = data.progress.find(
          (p: any) => String(p.classroom) === String(classroomId) || (typeof p.classroom === 'object' && p.classroom?.id === classroomId),
        )
        if (classroomProgress) {
          setProgress(classroomProgress)
        }
      }
    } catch (error) {
      console.error('진도 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (sessionNumber: number) => {
    setMarking(sessionNumber)
    try {
      const res = await fetch('/api/classroom-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ classroomId, sessionNumber }),
      })

      if (res.ok) {
        const updated = await res.json() as Progress
        setProgress({
          progressPercent: updated.progressPercent,
          completedSessions: updated.completedSessions,
        })
      }
    } catch (error) {
      console.error('회차 완료 기록 실패:', error)
    } finally {
      setMarking(null)
    }
  }

  const progressPercent = progress?.progressPercent ?? 0
  const completedCount = progress?.completedSessions?.length ?? 0
  const completedSessionNumbers = new Set(progress?.completedSessions?.map((s) => s.sessionNumber) ?? [])

  if (loading) {
    return <div className="h-16" /> // 로딩 중 공간 예약
  }

  return (
    <div className="space-y-4">
      {/* 진도 바 + 텍스트 */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-bold text-ink">학습 진도</h3>
          <span className="text-sm font-bold text-brand">
            {progressPercent}% ({completedCount}/{totalSessions})
          </span>
        </div>
        <div className="w-full h-3 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 회차별 완료 버튼 (세로 스택) */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-10">
        {Array.from({ length: totalSessions }, (_, i) => i + 1).map((sessionNum) => {
          const isCompleted = completedSessionNumbers.has(sessionNum)
          const isMarking = marking === sessionNum

          return (
            <button
              key={sessionNum}
              onClick={() => handleMarkComplete(sessionNum)}
              disabled={isMarking}
              className={`
                relative p-2 rounded-lg font-bold text-sm transition-all duration-200
                ${
                  isCompleted
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'bg-line text-sub hover:bg-[#ccc]'
                }
                ${isMarking ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                flex items-center justify-center min-h-10
              `}
              title={isCompleted ? `${sessionNum}회차 완료됨` : `${sessionNum}회차 완료 표시`}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span>{sessionNum}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* 안내 텍스트 */}
      <p className="text-xs text-sub pt-2">
        각 회차를 시청한 후 위의 버튼을 클릭해 진도를 기록하세요.
      </p>
    </div>
  )
}
