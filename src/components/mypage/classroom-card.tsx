'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ClassroomCardProps {
  slug: string
  level: string
  shortTitle: string
  expired: boolean
  expiry?: {
    date: Date
    daysLeft: number
  }
}

interface Progress {
  progressPercent: number
  completedSessions: Array<{ sessionNumber: number }>
}

export function ClassroomCard({ slug, level, shortTitle, expired, expiry }: ClassroomCardProps) {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 강의실 ID를 slug에서 추출하거나, 별도 API로 조회
    // 임시: slug로 강의실 정보 조회 후 ID 가져오기
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/classroom-progress', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const classroomProgress = data.progress.find((p: any) => {
            // slug 기반 매칭 (classroom이 객체일 수 있음)
            if (typeof p.classroom === 'object') {
              return p.classroom?.slug === slug
            }
            return false
          })
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

    fetchProgress()
  }, [slug])

  if (expired) {
    return (
      <div className="block p-4 rounded-xl border border-line bg-[#fafafa] opacity-60">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-400 mb-1">
              {level}
            </div>
            <p className="font-medium text-sub text-sm line-through">{shortTitle}</p>
            <p className="text-[11px] text-red-400 font-medium mt-0.5">
              수강 기간 종료 ({expiry!.date.toLocaleDateString('ko-KR')} 만료)
            </p>
          </div>
          <span className="text-gray-300 text-sm">종료</span>
        </div>
      </div>
    )
  }

  const progressPercent = progress?.progressPercent ?? 0
  const completedCount = progress?.completedSessions?.length ?? 0

  return (
    <Link
      href={`/classroom/${slug}`}
      className="block p-4 rounded-xl border border-line hover:border-[#D4756E] hover:bg-brand-light transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-light text-brand mb-1">
            {level}
          </div>
          <p className="font-medium text-ink text-sm">{shortTitle}</p>

          {/* 진도율 표시 */}
          {!loading && progress && (
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-medium text-sub">진도율</span>
                <span className="text-[11px] font-bold text-brand">
                  {progressPercent}% ({completedCount}/20)
                </span>
              </div>
              <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 수강 기간 안내 */}
          {expiry && (
            <p className={`text-[11px] mt-2 font-medium ${expiry.daysLeft <= 14 ? 'text-orange-400' : 'text-sub'}`}>
              수강 기간 D-{expiry.daysLeft} ({expiry.date.toLocaleDateString('ko-KR')} 까지)
            </p>
          )}
        </div>

        <span className="text-brand text-sm ml-3 flex-shrink-0">입장 →</span>
      </div>
    </Link>
  )
}
