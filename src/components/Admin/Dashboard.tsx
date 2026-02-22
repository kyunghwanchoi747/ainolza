'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, ClipboardList, CheckCircle2, Circle, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Language = 'ko' | 'en'

interface DashboardStats {
  pendingInquiries: number
  pendingOrders: number
  totalCourses: number
  totalPrograms: number
  totalPosts: number
  todayVisitors: number
  todayRevenue: number
}

const translations = {
  ko: {
    summary: '요약',
    todayStatus: '오늘의 현황',
    stats: '통계',
    contents: '컨텐츠',
    more: '더보기',
    lastUpdate: '마지막 업데이트',
    summaryCards: [
      {
        title: '기본설정',
        count: '4/4개 완료',
        items: [
          { text: '사이트 정보 설정하기', done: true, slug: 'globals/hero' },
          { text: '디자인 편집하기', done: true, slug: 'globals/hero' },
          { text: '약관 설정하기', done: true, slug: 'globals/shop-settings' },
          { text: '도메인 연결하기', done: true, slug: 'globals/seo-settings' },
        ],
      },
      {
        title: '판매하기',
        count: '2/3개 완료',
        items: [
          { text: '상품 추가하기', done: true, slug: 'products' },
          { text: '배송 설정하기', done: true, slug: 'globals/shop-settings' },
          { text: '네이버페이 신청하기', done: false, slug: 'globals/payment-settings' },
        ],
      },
      {
        title: '성장하기',
        count: '4/6개 완료',
        items: [
          { text: '검색엔진 등록하기', done: false, slug: 'globals/seo-settings' },
          { text: '검색엔진 최적화', done: true, slug: 'globals/seo-settings' },
          { text: '소셜 로그인 설정하기', done: false, slug: 'globals/payment-settings' },
          { text: '메일발송 설정하기', done: true, slug: 'globals/message-settings' },
          { text: 'SMS/알림톡 설정하기', done: true, slug: 'globals/message-settings' },
          { text: '방문자 분석하기', done: true, slug: 'site-stats' },
        ],
      },
      {
        title: '추천작업',
        count: '0/3개 완료',
        items: [
          { text: '운영진 설정하기', done: false, slug: 'users' },
          { text: '자동입금확인 설정하기', done: false, slug: 'globals/payment-settings' },
          { text: '채팅상담 설정하기', done: false, slug: 'inquiries' },
        ],
      },
    ],
    status: [
      { label: '신규주문', key: 'pendingOrders', color: 'text-red-500' },
      { label: '취소관리', key: 'canceled', color: 'text-slate-500' },
      { label: '반품관리', key: 'returned', color: 'text-slate-500' },
      { label: '교환관리', key: 'exchanged', color: 'text-slate-500' },
      { label: '답변대기 문의', key: 'pendingInquiries', color: 'text-blue-500' },
    ],
    table: {
      date: '일자',
      orders: '주문수',
      revenue: '매출액',
      visitors: '방문자',
      signups: '가입',
      inquiries: '문의',
      reviews: '후기',
    },
  },
  en: {
    summary: 'Summary',
    todayStatus: "Today's Status",
    stats: 'Statistics',
    contents: 'Contents',
    more: 'More',
    lastUpdate: 'Last Update',
    summaryCards: [
      {
        title: 'Basic Setup',
        count: '4/4 Completed',
        items: [
          { text: 'Site Info', done: true, slug: 'globals/hero' },
          { text: 'Edit Design', done: true, slug: 'globals/hero' },
          { text: 'Terms & Conditions', done: true, slug: 'globals/shop-settings' },
          { text: 'Connect Domain', done: true, slug: 'globals/seo-settings' },
        ],
      },
      {
        title: 'Selling',
        count: '2/3 Completed',
        items: [
          { text: 'Add Products', done: true, slug: 'products' },
          { text: 'Shipping Config', done: true, slug: 'globals/shop-settings' },
          { text: 'Apply Naver Pay', done: false, slug: 'globals/payment-settings' },
        ],
      },
      {
        title: 'Growth',
        count: '4/6 Completed',
        items: [
          { text: 'Search Engine Reg', done: false, slug: 'globals/seo-settings' },
          { text: 'SEO Optimization', done: true, slug: 'globals/seo-settings' },
          { text: 'Social Login', done: false, slug: 'globals/payment-settings' },
          { text: 'Email Config', done: true, slug: 'globals/message-settings' },
          { text: 'SMS/Notification', done: true, slug: 'globals/message-settings' },
          { text: 'Visitor Analytics', done: true, slug: 'site-stats' },
        ],
      },
      {
        title: 'Recommended',
        count: '0/3 Completed',
        items: [
          { text: 'Staff Setup', done: false, slug: 'users' },
          { text: 'Auto Bank Check', done: false, slug: 'globals/payment-settings' },
          { text: 'Chat Support', done: false, slug: 'inquiries' },
        ],
      },
    ],
    status: [
      { label: 'New Orders', key: 'pendingOrders', color: 'text-red-500' },
      { label: 'Canceled', key: 'canceled', color: 'text-slate-500' },
      { label: 'Returns', key: 'returned', color: 'text-slate-500' },
      { label: 'Exchanges', key: 'exchanged', color: 'text-slate-500' },
      { label: 'Pending Q&A', key: 'pendingInquiries', color: 'text-blue-500' },
    ],
    table: {
      date: 'Date',
      orders: 'Orders',
      revenue: 'Revenue',
      visitors: 'Visitors',
      signups: 'Signups',
      inquiries: 'Inquiries',
      reviews: 'Reviews',
    },
  },
}

export function Dashboard() {
  const [lang, setLang] = useState<Language>('ko')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const t = translations[lang]

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((res) => {
        const data = res as { success: boolean; summary: DashboardStats }
        if (data.success && data.summary) {
          setStats(data.summary)
        }
      })
      .catch((err) => console.error('Dashboard Stats Error:', err))
  }, [])

  return (
    <div className="p-10 bg-[#f4f7fa] min-h-screen font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">불편한 AI 클래스</h1>
          <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-200 ml-4">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${
                lang === 'ko' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${
                lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>
            {t.lastUpdate}: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-pink-500">
          <ClipboardList size={20} />
          <h2 className="font-bold text-lg">{t.summary}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {t.summaryCards.map((card, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">{card.title}</h3>
                <span className="text-xs text-slate-400 font-medium">{card.count}</span>
              </div>
              <div className="w-full h-1 bg-slate-100 mb-6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 transition-all duration-1000"
                  style={{
                    width: `${(card.items.filter((it) => it.done).length / card.items.length) * 100}%`,
                  }}
                />
              </div>
              <div className="space-y-4">
                {card.items.map((item, j) => (
                  <Link
                    key={j}
                    href={
                      item.slug.startsWith('globals')
                        ? `/admin/globals/${item.slug.split('/')[1]}`
                        : `/admin/collections/${item.slug}`
                    }
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    {item.done ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <Circle size={16} className="text-slate-200" />
                    )}
                    <span
                      className={`text-[13px] ${item.done ? 'text-slate-400' : 'text-slate-600 font-medium'} group-hover:text-blue-600 transition-colors`}
                    >
                      {item.text}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operations Status */}
      <div className="mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              오늘의 현황{' '}
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                {stats?.pendingOrders || 1}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {t.status.map((st, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-2 group hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <span className="text-xs text-slate-400">
                  {st.label}{' '}
                  {(st.key === 'pendingOrders' || st.key === 'pendingInquiries') && (
                    <span className={st.color}>{(stats as any)?.[st.key] || 0}</span>
                  )}
                </span>
                <span className={`text-xl font-bold text-slate-700`}>
                  {(stats as any)?.[st.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats & Charts Row */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitors Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" /> 통계
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <Circle size={8} className="fill-blue-500 text-blue-500" /> 페이지뷰
              </div>
              <div className="flex items-center gap-1.5">
                <Circle size={8} className="fill-blue-800 text-blue-800" /> 방문자
              </div>
              <button className="text-slate-500 hover:text-blue-600 ml-2">더보기 &gt;</button>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 relative mt-4">
            {/* Simple lines for axes */}
            <div className="absolute left-0 bottom-0 w-full h-px bg-slate-100" />
            <div className="absolute left-0 top-0 h-full w-px bg-slate-100" />

            {[20, 60, 30, 80, 50, 40, 45].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 relative group">
                <div
                  className="w-4 bg-blue-100/50 rounded-t-sm transition-all duration-500 hover:bg-blue-300"
                  style={{ height: `${h + 10}%` }}
                />
                <div
                  className="w-2 bg-blue-600 rounded-t-sm absolute bottom-0 transition-all duration-500 hover:bg-blue-800"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-slate-300 mt-2">02-{12 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-700">기간별 분석</h2>
            <button className="text-xs text-slate-400 hover:text-blue-600">더보기 &gt;</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-slate-400 font-medium border-b border-slate-50">
                <tr>
                  <th className="pb-3 pr-2">{t.table.date}</th>
                  <th className="pb-3 px-2 text-right">{t.table.orders}</th>
                  <th className="pb-3 px-2 text-right">{t.table.revenue}</th>
                  <th className="pb-3 px-2 text-right">{t.table.visitors}</th>
                  <th className="pb-3 px-2 text-right">{t.table.signups}</th>
                  <th className="pb-3 px-2 text-right">{t.table.inquiries}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    date: '2026-02-18',
                    orders: 0,
                    revenue: '0원',
                    visitors: 49,
                    signups: 2,
                    inquiries: 2,
                  },
                  {
                    date: '2026-02-17',
                    orders: 3,
                    revenue: '57,940원',
                    visitors: 52,
                    signups: 4,
                    inquiries: 2,
                  },
                  {
                    date: '2026-02-16',
                    orders: 3,
                    revenue: '59,400원',
                    visitors: 55,
                    signups: 3,
                    inquiries: 4,
                  },
                  {
                    date: '2026-02-15',
                    orders: 1,
                    revenue: '19,800원',
                    visitors: 51,
                    signups: 3,
                    inquiries: 3,
                  },
                  {
                    date: '2026-02-14',
                    orders: 2,
                    revenue: '39,600원',
                    visitors: 76,
                    signups: 7,
                    inquiries: 6,
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-500">{row.date}</td>
                    <td className="py-3 text-right font-medium">{row.orders}</td>
                    <td className="py-3 text-right font-medium">{row.revenue}</td>
                    <td className="py-3 text-right">{row.visitors}</td>
                    <td className="py-3 text-right font-medium text-blue-600">{row.signups}</td>
                    <td className="py-3 text-right">{row.inquiries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contents Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-orange-500">
          <DollarSign size={20} />
          <h2 className="font-bold text-lg">{t.contents}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-sm font-bold text-slate-700">최근 게시물</h3>
                <Link
                  href="/admin/collections/posts"
                  className="text-[11px] text-slate-400 hover:text-blue-600"
                >
                  전체보기
                </Link>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-slate-500 hover:text-blue-600 cursor-pointer"
                  >
                    <span className="truncate flex-1 pr-4">
                      AI를 활용한 자동화 클래스 {i === 1 ? '공지사항입니다.' : '커리큘럼 안내'}
                    </span>
                    <span className="text-[10px] text-slate-300">02-1{7 + i}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-sm font-bold text-slate-700">최근 문의/댓글</h3>
                <Link
                  href="/admin/collections/comments"
                  className="text-[11px] text-slate-400 hover:text-blue-600"
                >
                  전체보기
                </Link>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      익
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-slate-700 mb-0.5">최경환</div>
                      <p className="text-[10px] text-slate-500 truncate">
                        정말 유익한 강의였습니다! 다음 클래스도 기대되네요...
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-300">방금전</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
