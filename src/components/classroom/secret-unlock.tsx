'use client'

import { useState } from 'react'

interface SecretUnlockProps {
  password: string
  notionUrl: string
  label?: string
}

export function SecretUnlock({ password, notionUrl, label = '비밀 자료 열기' }: SecretUnlockProps) {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === password) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (unlocked) {
    return (
      <div className="mt-4 p-5 rounded-2xl border border-brand bg-brand-light text-center space-y-3">
        <p className="text-sm font-medium text-brand">🔓 잠금 해제됐습니다!</p>
        <a
          href={notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors text-sm"
        >
          {label} →
        </a>
      </div>
    )
  }

  return (
    <div className="mt-4 p-5 rounded-2xl border border-dashed border-line bg-[#fafafa]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔐</span>
        <p className="text-sm font-medium text-ink">비밀 공간 — 강의 중 알려드리는 비밀번호를 입력하세요</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false) }}
          placeholder="비밀번호 입력"
          className={`flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-brand transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-line'
          }`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-dark text-white text-sm font-medium rounded-xl hover:bg-ink transition-colors"
        >
          확인
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mt-2">비밀번호가 틀렸습니다.</p>}
    </div>
  )
}
