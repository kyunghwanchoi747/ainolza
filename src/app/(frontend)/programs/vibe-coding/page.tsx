import { redirect } from 'next/navigation'

// 기존 /programs/vibe-coding URL → 새 /store/vibe-coding-101 로 통합
export default function LegacyVibeCodingRedirect() {
  redirect('/store/vibe-coding-101')
}
