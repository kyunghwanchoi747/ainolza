'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Globe, FileText, ArrowLeft, Trash2, Home, Sparkles, ShoppingBag, GraduationCap, Users, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/manager/cn'

interface Page {
  id: number | string
  title: string
  slug: string
  status: 'draft' | 'published'
  updatedAt: string
}

// 현재 홈페이지 디자인과 동일한 Puck 초기 데이터
const HOME_PUCK_DATA = {
  content: [
    {
      type: 'Hero',
      props: {
        id: 'hero-home',
        badge: 'AI와 함께하는 스마트한 성장',
        headline: 'AI 놀자에서\n미래를 앞서가세요',
        subheadline:
          '비전공자와 3060 세대를 위한 가장 쉬운 AI 실무 커뮤니티. 최신 AI 트렌드부터 강의, 커뮤니티까지 한곳에서 경험하세요.',
        cta1Label: '무료 강의 시작하기',
        cta1Href: '/courses',
        cta2Label: '커뮤니티 둘러보기',
        cta2Href: '/community',
      },
    },
    {
      type: 'Features',
      props: {
        id: 'features-home',
        title: '',
        items: [
          { title: '실무 중심 강의', description: '현업에서 바로 쓰이는 실전 AI 활용법을 배웁니다.', color: '#2563eb' },
          { title: '열린 커뮤니티', description: '서로 돕고 성장하는 따뜻한 AI 소통 공간입니다.', color: '#7c3aed' },
          { title: '검증된 리소스', description: '엄선된 AI 도구와 자료를 큐레이션하여 제공합니다.', color: '#16a34a' },
        ],
      },
    },
    {
      type: 'CTABanner',
      props: {
        id: 'cta-home',
        headline: '지금 바로 AI 전문가로 거듭나세요',
        subheadline: '망설이는 매 순간 기술은 앞서나갑니다. AI 놀자와 함께라면 두렵지 않습니다.',
        buttonLabel: '회원가입하고 혜택 받기',
        buttonHref: '/login',
        gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)',
      },
    },
  ],
  root: { props: {} },
}

// 내비게이션 페이지 설정
const NAV_PAGES = [
  {
    slug: 'store',
    label: '스토어',
    href: '/shop',
    icon: ShoppingBag,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    description: '/shop 상단 배너 편집 (상품 목록은 그대로 유지)',
    initialData: {
      content: [{
        type: 'Hero',
        props: {
          id: 'hero-store',
          badge: 'AI 놀자 스토어',
          headline: '당신의 성장을 위한\n선별된 강의와 도구',
          subheadline: '당신의 성장을 도울 선별된 강의와 AI 도구를 만나보세요.',
          cta1Label: '전체 상품 보기',
          cta1Href: '/shop',
          cta2Label: '무료 강의',
          cta2Href: '/courses',
        },
      }],
      root: { props: {} },
    },
  },
  {
    slug: 'courses',
    label: '강의실',
    href: '/courses',
    icon: GraduationCap,
    color: 'bg-violet-100',
    iconColor: 'text-violet-600',
    description: '/courses 상단 배너 편집 (강의 목록은 그대로 유지)',
    initialData: {
      content: [{
        type: 'Hero',
        props: {
          id: 'hero-courses',
          badge: 'AI 놀자 강의실',
          headline: '나의 속도에 맞춰\n성장하는 AI 실무 러닝',
          subheadline: '비전공자와 3060 세대를 위한 가장 쉬운 AI 강의 플랫폼.',
          cta1Label: '강의 시작하기',
          cta1Href: '/courses',
          cta2Label: '커뮤니티 참여',
          cta2Href: '/community',
        },
      }],
      root: { props: {} },
    },
  },
  {
    slug: 'community',
    label: '커뮤니티',
    href: '/community',
    icon: Users,
    color: 'bg-orange-100',
    iconColor: 'text-orange-600',
    description: '/community 상단 배너 편집 (게시글 목록은 그대로 유지)',
    initialData: {
      content: [{
        type: 'Hero',
        props: {
          id: 'hero-community',
          badge: '커뮤니티',
          headline: '커뮤니티 광장',
          subheadline: '서로 돕고 성장하는 따뜻한 AI 소통 공간입니다.',
          cta1Label: '글 작성하기',
          cta1Href: '/community',
          cta2Label: '',
          cta2Href: '',
        },
      }],
      root: { props: {} },
    },
  },
  {
    slug: 'inquiry',
    label: '문의하기',
    href: '/inquiry',
    icon: HelpCircle,
    color: 'bg-pink-100',
    iconColor: 'text-pink-600',
    description: '/inquiry 전체 페이지 편집 (Puck 게시 시 기존 폼 대체)',
    initialData: {
      content: [
        {
          type: 'Hero',
          props: {
            id: 'hero-inquiry',
            badge: '문의하기',
            headline: '무엇이든\n물어보세요',
            subheadline: '궁금하신 점이나 제안하고 싶은 내용이 있다면 언제든 말씀해 주세요.',
            cta1Label: '',
            cta1Href: '',
            cta2Label: '',
            cta2Href: '',
          },
        },
        {
          type: 'TextSection',
          props: {
            id: 'contact-inquiry',
            title: '빠른 연락',
            body: '이메일: support@ainolja.com\n카카오: @AI놀자_공식\n운영시간: 평일 10:00 - 18:00 (점심 12-13시 제외)',
            align: 'center',
            dark: 'dark',
          },
        },
      ],
      root: { props: {} },
    },
  },
]

export default function DesignModePage() {
  const [pages, setPages] = useState<Page[]>([])
  const [homePage, setHomePage] = useState<Page | null>(null)
  const [navPages, setNavPages] = useState<Record<string, Page | null>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [initializingHome, setInitializingHome] = useState(false)
  const [initializingNav, setInitializingNav] = useState<string | null>(null)

  async function fetchPages() {
    setLoading(true)
    const res = await fetch('/api/manager/pages')
    const data = await res.json() as { docs?: Page[] }
    if (data.docs) {
      const reservedSlugs = ['home', ...NAV_PAGES.map((n) => n.slug)]
      const home = data.docs.find((p: Page) => p.slug === 'home') ?? null
      setHomePage(home)
      const navMap: Record<string, Page | null> = {}
      NAV_PAGES.forEach((nav) => {
        navMap[nav.slug] = data.docs.find((p: Page) => p.slug === nav.slug) ?? null
      })
      setNavPages(navMap)
      setPages(data.docs.filter((p: Page) => !reservedSlugs.includes(p.slug)))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPages()
  }, [])

  async function createPage() {
    if (!newTitle.trim() || !newSlug.trim()) return
    setCreating(true)
    const res = await fetch('/api/manager/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, slug: newSlug }),
    })
    const data = await res.json() as { id?: string | number }
    setCreating(false)
    if (data.id) {
      setShowForm(false)
      setNewTitle('')
      setNewSlug('')
      fetchPages()
    }
  }

  async function initializeHomePage() {
    setInitializingHome(true)
    const res = await fetch('/api/manager/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '홈페이지', slug: 'home', puckData: HOME_PUCK_DATA }),
    })
    const data = await res.json() as { id?: string | number }
    setInitializingHome(false)
    if (data.id) fetchPages()
  }

  async function initializeNavPage(nav: typeof NAV_PAGES[number]) {
    setInitializingNav(nav.slug)
    const res = await fetch('/api/manager/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: nav.label, slug: nav.slug, puckData: nav.initialData }),
    })
    const data = await res.json() as { id?: string | number }
    setInitializingNav(null)
    if (data.id) fetchPages()
  }

  async function deletePage(id: string | number) {
    if (!confirm('이 페이지를 삭제할까요?')) return
    await fetch(`/api/manager/pages/${id}`, { method: 'DELETE' })
    fetchPages()
  }

  function handleTitleChange(val: string) {
    setNewTitle(val)
    if (!newSlug || newSlug === slugify(newTitle)) {
      setNewSlug(slugify(val))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center h-14 px-6 bg-white border-b border-slate-200 shrink-0">
        <Link href="/manager" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mr-6">
          <ArrowLeft size={15} />
          관리자로
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Pencil size={13} className="text-white" />
          </div>
          <h1 className="text-sm font-bold text-slate-800">디자인 모드</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          새 페이지
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* New page form */}
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4">새 페이지 만들기</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">페이지 제목</label>
                  <input
                    value={newTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="예: 소개 페이지"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">URL 경로</label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">/p/</span>
                    <input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="about"
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={createPage}
                  disabled={creating || !newTitle.trim() || !newSlug.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creating ? '생성 중...' : '만들기'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setNewTitle(''); setNewSlug('') }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 홈페이지 특별 카드 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-2">
              <Home size={13} className="text-blue-600" />
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">홈페이지 (메인 화면)</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">로딩 중...</div>
            ) : homePage ? (
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Home size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">홈페이지</p>
                    <span className={cn(
                      'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                      homePage.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'
                    )}>
                      {homePage.status === 'published' ? '게시됨' : '초안 — 미적용'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    / (메인 화면) · 수정: {homePage.updatedAt?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {homePage.status === 'published' && (
                    <a href="/" target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="홈페이지 보기">
                      <Globe size={14} />
                    </a>
                  )}
                  <Link
                    href={`/manager/design/${homePage.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Pencil size={12} />
                    편집
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">홈페이지가 아직 연동되지 않았습니다</p>
                <p className="text-xs text-slate-400 mb-5">
                  현재 홈페이지 디자인을 그대로 불러와 디자인 모드에서 편집할 수 있게 연동합니다.
                </p>
                <button
                  onClick={initializeHomePage}
                  disabled={initializingHome}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Sparkles size={14} />
                  {initializingHome ? '연동 중...' : '홈페이지 디자인 모드로 연동하기'}
                </button>
              </div>
            )}
          </div>

          {/* 내비게이션 페이지 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center gap-2">
              <Globe size={13} className="text-slate-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">내비게이션 페이지</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">로딩 중...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {NAV_PAGES.map((nav) => {
                  const page = navPages[nav.slug]
                  const Icon = nav.icon
                  const isInitializing = initializingNav === nav.slug
                  return (
                    <div key={nav.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', nav.color)}>
                        <Icon size={18} className={nav.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">{nav.label}</p>
                          {page ? (
                            <span className={cn(
                              'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                              page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'
                            )}>
                              {page.status === 'published' ? '게시됨' : '초안 — 미적용'}
                            </span>
                          ) : (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-400">
                              미연동
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{nav.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {page?.status === 'published' && (
                          <a href={nav.href} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="페이지 보기">
                            <Globe size={14} />
                          </a>
                        )}
                        {page ? (
                          <Link
                            href={`/manager/design/${page.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Pencil size={12} />
                            편집
                          </Link>
                        ) : (
                          <button
                            onClick={() => initializeNavPage(nav)}
                            disabled={isInitializing}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                          >
                            <Sparkles size={12} />
                            {isInitializing ? '연동 중...' : '연동하기'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 일반 페이지 목록 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">추가 페이지 목록</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 text-sm">로딩 중...</div>
            ) : pages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FileText size={32} className="mb-3 opacity-20" />
                <p className="text-sm">추가 페이지가 없습니다.</p>
                <button onClick={() => setShowForm(true)} className="mt-4 text-sm text-blue-600 hover:underline">
                  새 페이지 만들기
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">{page.title}</p>
                        <span className={cn(
                          'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                          page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        )}>
                          {page.status === 'published' ? '게시됨' : '초안'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        /p/{page.slug} · {page.updatedAt?.slice(0, 10)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {page.status === 'published' && (
                        <a href={`/p/${page.slug}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="프론트에서 보기">
                          <Globe size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <Link
                      href={`/manager/design/${page.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <Pencil size={12} />
                      편집
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center">
            홈페이지는 <strong>게시하기</strong> 버튼 클릭 시 메인 화면(<strong>/</strong>)에 즉시 반영됩니다.
            추가 페이지는 <strong>/p/[slug]</strong> 경로로 접근합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
