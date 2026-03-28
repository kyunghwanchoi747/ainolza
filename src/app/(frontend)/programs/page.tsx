import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function ProgramsPage() {
  const programs = [
    {
      slug: 'vibe-coding',
      title: 'AI 바이브 코딩 클래스',
      desc: '나만의 독립된 웹사이트를 AI로 직접 만드는 실전 과정. 코딩 경험 0도 OK.',
      image: '/programs/바이브코딩상세1.png',
      tag: '모집중',
      tagColor: 'bg-green-400 text-black',
      duration: '4주 | 온라인',
      price: '390,000',
    },
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-foreground/40 uppercase tracking-[0.2em] mb-3">Programs</p>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">프로그램</h1>
          <p className="text-foreground/50 text-lg mb-16">AI놀자에서 운영하는 교육 프로그램입니다.</p>

          <div className="grid gap-8">
            {programs.map(p => (
              <Link
                key={p.slug}
                href={`/programs/${p.slug}`}
                className="group block rounded-2xl border border-foreground/10 hover:border-foreground/20 overflow-hidden transition-all"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.tagColor}`}>{p.tag}</span>
                        <span className="text-foreground/30 text-sm">{p.duration}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-foreground/80 transition-colors">{p.title}</h2>
                      <p className="text-foreground/50 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                      <span className="text-xl font-bold">&#8361;{p.price}</span>
                      <span className="flex items-center gap-2 text-sm text-foreground/50 group-hover:text-foreground transition-colors">
                        자세히 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
