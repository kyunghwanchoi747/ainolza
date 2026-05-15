'use client'

import Link from 'next/link'
import { useState, useMemo, useCallback } from 'react'
import { AXES, type IkigaiAxis } from './data'
import { IkigaiDiagram } from './ikigai-diagram'

type Answers = {
  love: string[]
  good_at: string[]
  world: string[]
  paid: string
}

type ResultPayload = {
  summary: string
  keywords: string[]
  passion: { title: string; body: string }
  profession: { title: string; body: string }
  vocation: { title: string; body: string }
  mission: { title: string; body: string }
  first_steps: string[]
  closing: string
}

const EMPTY_ANSWERS: Answers = { love: [], good_at: [], world: [], paid: '' }

export function IkigaiClient() {
  const [step, setStep] = useState<number>(0) // 0=인트로, 1~4=단계, 5=결과
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentAxis: IkigaiAxis | null = step >= 1 && step <= 4 ? AXES[step - 1] : null

  const canProceed = useMemo(() => {
    if (!currentAxis) return false
    if (currentAxis.key === 'paid') {
      // paid는 자유 입력 — 비어 있어도 "아직 모르겠어요"로 진행 가능
      return true
    }
    const picked = answers[currentAxis.key as 'love' | 'good_at' | 'world'].length
    return picked >= currentAxis.minSelect
  }, [currentAxis, answers])

  const togglePick = useCallback((axisKey: 'love' | 'good_at' | 'world', value: string, max: number) => {
    setAnswers((prev) => {
      const list = prev[axisKey]
      if (list.includes(value)) {
        return { ...prev, [axisKey]: list.filter((v) => v !== value) }
      }
      if (list.length >= max) return prev
      return { ...prev, [axisKey]: [...list, value] }
    })
  }, [])

  const submit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ikigai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const data = (await res.json()) as ResultPayload
      setResult(data)
      setStep(5)
    } catch (e) {
      setError((e as Error).message || '결과를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }, [answers])

  const reset = () => {
    setStep(0)
    setAnswers(EMPTY_ANSWERS)
    setResult(null)
    setError(null)
  }

  // ────────── 인트로 ──────────
  if (step === 0) {
    return <Intro onStart={() => setStep(1)} />
  }

  // ────────── 결과 ──────────
  if (step === 5 && result) {
    return <ResultView answers={answers} result={result} onReset={reset} />
  }

  // ────────── 4단계 입력 ──────────
  if (!currentAxis) return null

  const progress = (step / 4) * 100

  return (
    <div className="mx-auto w-full max-w-2xl px-5 sm:px-6">
      {/* 상단 진행 표시 */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-sub mb-2">
          <span>{step} / 4 단계</span>
          <button onClick={reset} className="hover:text-ink transition-colors">
            처음으로
          </button>
        </div>
        <div className="h-0.5 w-full bg-line">
          <div
            className="h-full bg-ink transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 단계 헤더 */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] text-brand uppercase mb-2">STEP {step}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">{currentAxis.title}</h2>
        <p className="text-sm text-sub leading-relaxed">{currentAxis.prompt}</p>
        {currentAxis.key !== 'paid' && (
          <p className="text-xs text-sub mt-3">
            <span className="text-ink font-medium">
              {currentAxis.minSelect}~{currentAxis.maxSelect}개
            </span>{' '}
            선택해주세요 · 현재{' '}
            <span className="text-ink font-medium">
              {answers[currentAxis.key as 'love' | 'good_at' | 'world'].length}개
            </span>
          </p>
        )}
      </div>

      {/* 옵션 영역 */}
      {currentAxis.key === 'paid' ? (
        <PaidInput
          value={answers.paid}
          onChange={(v) => setAnswers((a) => ({ ...a, paid: v }))}
        />
      ) : (
        <div className="flex flex-wrap gap-2 mb-10">
          {currentAxis.options.map((opt) => {
            const selected = answers[currentAxis.key as 'love' | 'good_at' | 'world'].includes(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => togglePick(currentAxis.key as 'love' | 'good_at' | 'world', opt.value, currentAxis.maxSelect)}
                className={[
                  'px-4 py-2.5 rounded-full text-sm transition-all border',
                  selected
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink border-line hover:border-ink',
                ].join(' ')}
              >
                <span>{opt.label}</span>
                {opt.hint && !selected && <span className="ml-1.5 text-xs text-sub">· {opt.hint}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="flex items-center justify-between border-t border-line pt-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="text-sm text-sub hover:text-ink transition-colors"
        >
          ← 이전
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
            className={[
              'px-6 py-3 rounded-full text-sm font-semibold transition-all',
              canProceed
                ? 'bg-ink text-white hover:bg-black'
                : 'bg-line text-sub cursor-not-allowed',
            ].join(' ')}
          >
            다음 →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className={[
              'px-6 py-3 rounded-full text-sm font-semibold transition-all',
              loading
                ? 'bg-line text-sub cursor-not-allowed'
                : 'bg-ink text-white hover:bg-black',
            ].join(' ')}
          >
            {loading ? 'AI가 정리하는 중…' : '결과 보기'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-brand">{error}</p>
      )}
    </div>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 sm:px-6 text-center">
      <p className="text-xs tracking-[0.2em] text-brand uppercase mb-3">IKIGAI · 生き甲斐</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-5">
        아침에 일어날 이유를 찾는<br />네 가지 질문
      </h2>
      <p className="text-base text-sub leading-relaxed mb-10 break-keep">
        이키가이는 일본어로 ‘살아갈 보람’을 뜻합니다. 거대한 천직이 아니라,
        오늘 하루를 시작할 작은 이유. 좋아하는 것 · 잘하는 것 · 세상이 필요로
        하는 것 · 돈으로 연결되는 것, 네 가지가 만나는 자리를 함께 찾아봅니다.
      </p>

      <div className="mb-10">
        <IkigaiDiagram showLabels />
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 rounded-full bg-ink text-white text-sm font-semibold hover:bg-black transition-colors"
      >
        시작하기 (3분 소요)
      </button>

      <p className="text-xs text-sub mt-5">
        총 4단계 · 마지막에 AI가 결과지를 만들어 드립니다
      </p>
    </div>
  )
}

function PaidInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const presets = ['아직 모르겠어요', '지금 하는 일을 이어가고 싶음', '새로운 분야로 옮기고 싶음', '취미를 일로 만들고 싶음']
  return (
    <div className="mb-10">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="예: 회계 관련 일을 20년 했어요. / 손글씨를 잘 써서 가끔 청첩장을 만들어줘요. / 사람들이 자주 상담을 청해와요."
        className="w-full bg-surface border border-line rounded-2xl p-4 text-sm text-ink placeholder:text-sub focus:outline-none focus:border-ink resize-none transition-colors"
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="px-3 py-1.5 rounded-full text-xs text-sub border border-line hover:border-ink hover:text-ink transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultView({
  answers,
  result,
  onReset,
}: {
  answers: Answers
  result: ResultPayload
  onReset: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.2em] text-brand uppercase mb-3">YOUR IKIGAI</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink leading-tight mb-6 break-keep">
          {result.summary}
        </h2>
        <div className="inline-flex flex-wrap gap-2 justify-center max-w-xl">
          {result.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full bg-brand-light text-brand text-sm font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 4원 다이어그램 — 사용자 답변을 축에 배치 */}
      <div className="mb-12">
        <IkigaiDiagram
          showLabels
          loveItems={answers.love}
          goodAtItems={answers.good_at}
          worldItems={answers.world}
          paidItems={answers.paid ? [answers.paid] : []}
          centerKeywords={result.keywords}
        />
      </div>

      {/* 4 교집합 */}
      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <IntersectionCard label="열정 (Passion)" hint="좋아하는 것 + 잘하는 것" data={result.passion} />
        <IntersectionCard label="천직 (Vocation)" hint="세상이 필요로 하는 것 + 돈으로 연결되는 것" data={result.vocation} />
        <IntersectionCard label="사명 (Mission)" hint="좋아하는 것 + 세상이 필요로 하는 것" data={result.mission} />
        <IntersectionCard label="직업 (Profession)" hint="잘하는 것 + 돈으로 연결되는 것" data={result.profession} />
      </div>

      {/* 작은 첫걸음 */}
      <div className="border-t border-line pt-10 mb-12">
        <h3 className="text-lg font-bold text-ink mb-2">이번 주에 시도해볼 작은 첫걸음</h3>
        <p className="text-sm text-sub mb-5">
          거창한 결심 대신, 일주일 안에 실행 가능한 행동입니다.
        </p>
        <ol className="space-y-3">
          {result.first_steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full border border-line flex items-center justify-center text-xs text-sub">
                {i + 1}
              </span>
              <span className="break-keep">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-line pt-10 mb-12">
        <p className="text-sm text-sub leading-relaxed break-keep">{result.closing}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-full border border-line text-ink text-sm hover:border-ink transition-colors"
        >
          다시 해보기
        </button>
        <Link
          href="/programs/vibe-coding"
          className="px-6 py-3 rounded-full bg-ink text-white text-sm font-semibold hover:bg-black transition-colors text-center"
        >
          AI놀자 강의 둘러보기 →
        </Link>
      </div>
    </div>
  )
}

function IntersectionCard({
  label,
  hint,
  data,
}: {
  label: string
  hint: string
  data: { title: string; body: string }
}) {
  return (
    <div className="border border-line rounded-2xl p-6">
      <p className="text-xs text-sub mb-1">{label}</p>
      <p className="text-xs text-sub mb-3">{hint}</p>
      <h4 className="text-base font-bold text-ink mb-2">{data.title}</h4>
      <p className="text-sm text-sub leading-relaxed break-keep">{data.body}</p>
    </div>
  )
}
