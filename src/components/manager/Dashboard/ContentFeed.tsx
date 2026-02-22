import Link from 'next/link'
import { FileText, MessageCircle, ExternalLink } from 'lucide-react'

interface FeedItem {
  id: string | number
  title: string
  date?: string
  href: string
}

interface ContentFeedProps {
  recentPosts: FeedItem[]
  recentInquiries: FeedItem[]
}

export function ContentFeed({ recentPosts, recentInquiries }: ContentFeedProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">상품 구매평</span>
          </div>
          <Link href="/manager/shopping/reviews" className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5">
            더보기 <ExternalLink size={10} />
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-4">데이터 없음</p>
        ) : (
          <ul className="space-y-2">
            {recentPosts.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-2 group"
                >
                  <span className="text-[11px] text-slate-600 group-hover:text-blue-600 truncate flex-1">
                    {item.title}
                  </span>
                  {item.date && (
                    <span className="text-[10px] text-slate-400 shrink-0">{item.date.slice(5, 10)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MessageCircle size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">상품 문의</span>
          </div>
          <Link href="/manager/shopping/inquiries" className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5">
            더보기 <ExternalLink size={10} />
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-4">데이터 없음</p>
        ) : (
          <ul className="space-y-2">
            {recentInquiries.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="flex items-start gap-2 group">
                  <span className="text-[11px] text-slate-600 group-hover:text-blue-600 truncate flex-1">
                    {item.title}
                  </span>
                  {item.date && (
                    <span className="text-[10px] text-slate-400 shrink-0">{item.date.slice(5, 10)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs font-semibold text-slate-700">컨텐츠 반응</span>
        </div>
        <div className="space-y-3">
          <Link href="/manager/content" className="flex items-center justify-between group">
            <span className="text-[11px] text-slate-600 group-hover:text-blue-600">블로그/칼럼</span>
            <ExternalLink size={10} className="text-slate-300 group-hover:text-blue-400" />
          </Link>
          <Link href="/admin/collections/community-posts" className="flex items-center justify-between group" target="_blank">
            <span className="text-[11px] text-slate-600 group-hover:text-blue-600">커뮤니티 포스트</span>
            <ExternalLink size={10} className="text-slate-300 group-hover:text-blue-400" />
          </Link>
          <Link href="/admin/collections/comments" className="flex items-center justify-between group" target="_blank">
            <span className="text-[11px] text-slate-600 group-hover:text-blue-600">댓글 관리</span>
            <ExternalLink size={10} className="text-slate-300 group-hover:text-blue-400" />
          </Link>
          <Link href="/admin/collections/media" className="flex items-center justify-between group" target="_blank">
            <span className="text-[11px] text-slate-600 group-hover:text-blue-600">미디어 파일</span>
            <ExternalLink size={10} className="text-slate-300 group-hover:text-blue-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}
