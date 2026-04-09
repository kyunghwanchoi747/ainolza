'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FaqItem = {
  question: string
  answer: string
}

export function ProductFaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#D4756E]/20 transition-all"
        >
          <button
            type="button"
            className="w-full text-left p-6 flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="flex items-start gap-4 min-w-0 pr-3">
              <span className="text-[#D4756E] text-sm font-extrabold mt-0.5 shrink-0">Q</span>
              <span className="text-base md:text-lg font-bold text-[#333]">{item.question}</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#999] transition-transform shrink-0 ${
                open === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-6 pl-14 text-[#666] text-sm md:text-base leading-relaxed whitespace-pre-line">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
