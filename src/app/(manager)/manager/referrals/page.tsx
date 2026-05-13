'use client'

import { useEffect, useState } from 'react'

type ReferralDoc = {
  id: number
  code: string
  user: { id: number; email: string; name?: string } | number
  status: 'active' | 'disabled'
  payoutBank?: string
  payoutAccountNum?: string
  payoutHolder?: string
  totalReferrals?: number
  totalRewardKrw?: number
  paidOutKrw?: number
  memo?: string
  createdAt?: string
}

type UserOption = { id: number; email: string; name?: string }

export default function ManagerReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralDoc[]>([])
  const [stats, setStats] = useState<Record<string, { paidCount: number; totalReward: number; pendingPayout: number }>>(
    {},
  )
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // 신규 발급 폼
  const [userSearch, setUserSearch] = useState('')
  const [userOptions, setUserOptions] = useState<UserOption[]>([])
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)
  const [payoutBank, setPayoutBank] = useState('')
  const [payoutAccountNum, setPayoutAccountNum] = useState('')
  const [payoutHolder, setPayoutHolder] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [memo, setMemo] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/manager/referrals', { credentials: 'include' })
      if (!res.ok) throw new Error()
      const data = (await res.json()) as { docs: ReferralDoc[]; stats: typeof stats }
      setReferrals(data.docs || [])
      setStats(data.stats || {})
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // 회원 검색 (이메일/이름)
  useEffect(() => {
    if (!userSearch || userSearch.length < 2) {
      setUserOptions([])
      return
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/users?where[or][0][email][contains]=${encodeURIComponent(userSearch)}&where[or][1][name][contains]=${encodeURIComponent(userSearch)}&limit=10&depth=0`,
          { credentials: 'include' },
        )
        if (!res.ok) return
        const data = (await res.json()) as { docs?: UserOption[] }
        setUserOptions((data.docs || []).map((u) => ({ id: u.id, email: u.email, name: u.name })))
      } catch {
        // ignore
      }
    }, 250)
    return () => clearTimeout(t)
  }, [userSearch])

  const issue = async () => {
    if (!selectedUser) {
      alert('회원을 먼저 선택해 주세요.')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/manager/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUser.id,
          payoutBank: payoutBank.trim() || undefined,
          payoutAccountNum: payoutAccountNum.replace(/[^0-9]/g, '') || undefined,
          payoutHolder: payoutHolder.trim() || undefined,
          customCode: customCode.trim() || undefined,
          memo: memo.trim() || undefined,
        }),
      })
      const data = (await res.json()) as any
      if (!res.ok || !data.ok) {
        alert(data.error || '발급 실패')
        return
      }
      alert(data.alreadyIssued ? '이미 발급된 코드가 있습니다.' : `코드 발급 완료: ${data.referral.code}`)
      // 폼 초기화
      setSelectedUser(null)
      setUserSearch('')
      setUserOptions([])
      setPayoutBank('')
      setPayoutAccountNum('')
      setPayoutHolder('')
      setCustomCode('')
      setMemo('')
      load()
    } catch {
      alert('발급 실패')
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (r: ReferralDoc) => {
    const next = r.status === 'active' ? 'disabled' : 'active'
    if (!confirm(`상태를 ${next === 'active' ? '활성' : '중지'}로 변경하시겠습니까?`)) return
    try {
      const res = await fetch(`/api/manager/referrals/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error()
      load()
    } catch {
      alert('변경 실패')
    }
  }

  const payout = async (r: ReferralDoc) => {
    if (!confirm(`${r.code} 코드의 미지급 보상을 일괄 지급 완료 처리하시겠습니까?\n실제 송금은 토스뱅크에서 별도로 진행해 주세요.`)) return
    try {
      const res = await fetch(`/api/manager/referrals/${r.id}/payout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = (await res.json()) as any
      if (!res.ok || !data.ok) {
        alert(data.error || '처리 실패')
        return
      }
      alert(`${data.processedOrders}건 / ${data.payoutSum.toLocaleString()}원 처리 완료`)
      load()
    } catch {
      alert('처리 실패')
    }
  }

  return (
    <div className="p-6 max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink mb-1">파트너스 (어필리에이트)</h1>
        <p className="text-sm text-sub">
          1기 수강생 카톡 신청 → 회원 선택 + 정산 계좌 입력 + 코드 발급. 발급된 코드를 카톡으로 전달.
        </p>
      </div>

      {/* 신규 발급 폼 */}
      <div className="rounded-2xl border border-line p-6 bg-white space-y-4">
        <h2 className="font-bold text-ink">새 파트너 발급</h2>

        <div>
          <label className="block text-sm text-sub mb-1.5">회원 검색 (이메일 또는 이름)</label>
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="이메일 또는 이름의 일부"
            className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink"
          />
          {selectedUser && (
            <div className="mt-2 text-sm text-ink">
              선택됨: <strong>{selectedUser.name || '-'}</strong> ({selectedUser.email}){' '}
              <button onClick={() => setSelectedUser(null)} className="text-xs text-sub underline ml-2">
                초기화
              </button>
            </div>
          )}
          {!selectedUser && userOptions.length > 0 && (
            <div className="mt-2 border border-line rounded-md max-h-48 overflow-y-auto">
              {userOptions.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u)
                    setUserOptions([])
                    setUserSearch('')
                    if (!payoutHolder) setPayoutHolder(u.name || '')
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-surface border-b border-line last:border-b-0"
                >
                  <strong>{u.name || '(이름 없음)'}</strong> · <span className="text-sub">{u.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-sub mb-1.5">정산 은행</label>
            <input
              value={payoutBank}
              onChange={(e) => setPayoutBank(e.target.value)}
              placeholder="예: 토스뱅크"
              className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-sm text-sub mb-1.5">정산 계좌번호</label>
            <input
              value={payoutAccountNum}
              onChange={(e) => setPayoutAccountNum(e.target.value.replace(/[^\d-]/g, ''))}
              placeholder="숫자만"
              className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-sub mb-1.5">예금주</label>
            <input
              value={payoutHolder}
              onChange={(e) => setPayoutHolder(e.target.value)}
              placeholder="예금주명"
              className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-sub mb-1.5">코드 (선택 — 빈칸 시 자동 생성)</label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="예: CHOI23 (영숫자 대문자)"
              maxLength={10}
              className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-sub mb-1.5">메모 (선택)</label>
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="관리용 메모"
              className="w-full px-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <button
          onClick={issue}
          disabled={creating || !selectedUser}
          className="px-5 py-2.5 bg-ink text-white text-sm font-bold rounded-md disabled:opacity-50"
        >
          {creating ? '발급 중...' : '코드 발급'}
        </button>
      </div>

      {/* 목록 */}
      <div>
        <h2 className="font-bold text-ink mb-3">발급된 파트너 코드 ({referrals.length})</h2>
        {loading ? (
          <p className="text-sm text-sub">로딩 중...</p>
        ) : referrals.length === 0 ? (
          <p className="text-sm text-sub">발급된 코드가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => {
              const u = typeof r.user === 'object' ? r.user : null
              const st = stats[r.code] || { paidCount: 0, totalReward: 0, pendingPayout: 0 }
              const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/store/vibe-coding-101?ref=${r.code}`
              return (
                <div key={r.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono font-bold text-ink text-base">{r.code}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            r.status === 'active' ? 'bg-surface text-ink' : 'bg-gray-200 text-sub'
                          }`}
                        >
                          {r.status === 'active' ? '활성' : '중지'}
                        </span>
                      </div>
                      <div className="text-sm text-sub">
                        <strong className="text-ink">{u?.name || '-'}</strong> · {u?.email || '-'}
                      </div>
                      {(r.payoutBank || r.payoutAccountNum) && (
                        <div className="text-xs text-sub mt-1">
                          정산: {r.payoutBank || '-'} {r.payoutAccountNum || '-'} ({r.payoutHolder || '-'})
                        </div>
                      )}
                      <div className="text-xs text-sub mt-2 font-mono break-all">{link}</div>
                    </div>
                    <div className="text-right text-sm shrink-0">
                      <div className="text-sub">
                        결제 전환 <strong className="text-ink">{st.paidCount}</strong>건
                      </div>
                      <div className="text-sub">
                        누적 보상 <strong className="text-ink">{st.totalReward.toLocaleString()}원</strong>
                      </div>
                      <div className="text-sub">
                        미지급 <strong className="text-red-600">{st.pendingPayout.toLocaleString()}원</strong>
                      </div>
                      {r.paidOutKrw ? (
                        <div className="text-sub">
                          지급 완료 {(r.paidOutKrw || 0).toLocaleString()}원
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link)
                        alert('링크 복사됨')
                      }}
                      className="text-xs px-3 py-1.5 border border-line rounded text-ink hover:bg-surface"
                    >
                      링크 복사
                    </button>
                    {st.pendingPayout > 0 && (
                      <button
                        onClick={() => payout(r)}
                        className="text-xs px-3 py-1.5 bg-ink text-white rounded hover:bg-ink/90"
                      >
                        지급 처리 ({st.pendingPayout.toLocaleString()}원)
                      </button>
                    )}
                    <button
                      onClick={() => toggleStatus(r)}
                      className="text-xs px-3 py-1.5 border border-line rounded text-sub hover:text-ink"
                    >
                      {r.status === 'active' ? '중지' : '활성화'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
