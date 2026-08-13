'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CategoryTabs } from '@/components/store/category-tabs'

type StoreCardProduct = {
  slug: string
  title: string
  shortDescription?: string
  category: string
  displayCategory: string
  price?: number
  originalPrice?: number
  priceLabel?: string
  thumbnail: string
  dday: number | null
  externalLink?: string
}

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

export function StoreProductGrid({ products }: { products: StoreCardProduct[] }) {
  const [tab, setTab] = useState('all')
  const filtered = tab === 'all' ? products : products.filter((p) => p.displayCategory === tab)

  return (
    <>
      <CategoryTabs active={tab} onChange={setTab} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const cardClass =
            'group rounded-3xl border-2 border-line overflow-hidden hover:border-[#D4756E]/40 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer'
          const inner = (
            <>
              <div className="relative aspect-square bg-surface overflow-hidden flex items-center justify-center p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {p.dday !== null && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-extrabold shadow-md">
                    D-{p.dday}
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs text-sub mb-2 font-bold tracking-wide uppercase">{p.category}</p>
                <h3 className="font-extrabold text-lg md:text-xl text-ink mb-3 line-clamp-2 leading-snug whitespace-pre-line group-hover:text-brand transition-colors">
                  {p.title}
                </h3>
                {p.shortDescription && (
                  <p className="text-sm text-body mb-4 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                )}
                <div className="flex items-baseline gap-2 mt-3">
                  {p.priceLabel ? (
                    <p className="text-brand font-extrabold text-base">{p.priceLabel}</p>
                  ) : p.price ? (
                    <>
                      <p className="text-brand font-extrabold text-2xl">{formatPrice(p.price)}</p>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <p className="text-sm text-sub line-through">{formatPrice(p.originalPrice)}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-sub">가격 정보 준비 중</p>
                  )}
                </div>
              </div>
            </>
          )
          return p.externalLink ? (
            <a key={p.slug} href={p.externalLink} target="_blank" rel="noopener noreferrer" className={cardClass}>
              {inner}
            </a>
          ) : (
            <Link key={p.slug} href={`/store/${p.slug}`} className={cardClass}>
              {inner}
            </Link>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sub py-16">해당 카테고리에 등록된 상품이 없습니다.</p>
      )}
    </>
  )
}
