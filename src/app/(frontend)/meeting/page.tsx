'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function MeetingPage() {
  const [meeting, setMeeting] = useState<{
    id: number
    room_name: string
    title: string
    has_password: number
    created_at: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)
  const jitsiRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)

  useEffect(() => {
    fetch('/api/meeting')
      .then(r => r.json() as Promise<{ meeting: typeof meeting }>)
      .then(d => setMeeting(d.meeting))
      .finally(() => setLoading(false))
  }, [])

  function joinMeeting() {
    if (!meeting) return

    // 비밀번호 확인
    if (meeting.has_password && !password) {
      setPwError(true)
      return
    }

    setJoined(true)
  }

  useEffect(() => {
    if (!joined || !meeting || !jitsiRef.current) return

    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      if (!jitsiRef.current) return
      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: meeting.room_name,
        parentNode: jitsiRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'raisehand', 'tileview',
          ],
        },
      })
    }
    document.head.appendChild(script)

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [joined, meeting])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sub">확인 중...</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-ink mb-3">현재 열린 회의실이 없습니다</h1>
          <p className="text-body text-sm mb-8">회의가 시작되면 이 페이지에서 바로 입장할 수 있습니다.</p>
          <Link href="/" className="text-sm text-brand hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  if (joined) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div ref={jitsiRef} className="w-full h-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎥</div>
        <h1 className="text-2xl font-bold text-ink mb-2">회의실 입장</h1>
        <p className="text-brand font-semibold text-lg mb-6">{meeting.title}</p>

        {meeting.has_password ? (
          <div className="mb-6">
            <p className="text-body text-sm mb-3">입장 코드를 입력해주세요</p>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPwError(false) }}
              onKeyDown={e => e.key === 'Enter' && joinMeeting()}
              placeholder="입장 코드"
              className="w-full px-4 py-3 border border-line rounded-xl text-ink placeholder-hint focus:outline-none focus:border-brand transition-colors text-center text-lg tracking-widest"
            />
            {pwError && <p className="text-red-500 text-sm mt-2">입장 코드를 입력해주세요.</p>}
          </div>
        ) : (
          <p className="text-body text-sm mb-6">아래 버튼을 눌러 회의실에 입장하세요.</p>
        )}

        <button
          onClick={joinMeeting}
          className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors text-lg"
        >
          입장하기 →
        </button>

        <p className="text-sub text-xs mt-4">카메라와 마이크 사용 권한이 필요합니다</p>
      </div>
    </div>
  )
}
