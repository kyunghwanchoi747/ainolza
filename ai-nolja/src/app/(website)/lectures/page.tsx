import { LectureCard } from '@/components/lectures/lecture-card'
import { sanityFetch } from '@/sanity/lib/fetch'
import { LECTURES_QUERY } from '@/sanity/lib/queries'

export default async function LecturesPage() {
  const lectures = await sanityFetch({ query: LECTURES_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          The Path: <span className="text-primary">Curriculum</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          단순한 지식 전달이 아닙니다.
          <br />
          당신의 &apos;맥락&apos;을 완성하는 체계적인 로드맵을 따라오세요.
        </p>
      </div>

      {/* Roadmap Visualization (Simplified) */}
      <div className="mb-16 grid gap-4 md:grid-cols-3 text-center">
        <div className="p-6 rounded-lg bg-secondary/20 border border-border/50">
          <div className="text-xl font-bold mb-2">Step 1. Prompting</div>
          <p className="text-sm text-muted-foreground">AI와 친해지기</p>
        </div>
        <div className="p-6 rounded-lg bg-secondary/40 border border-border/50">
          <div className="text-xl font-bold mb-2">Step 2. Reviewing</div>
          <p className="text-sm text-muted-foreground">업무 자동화 설계</p>
        </div>
        <div className="p-6 rounded-lg bg-secondary/60 border border-border/50">
          <div className="text-xl font-bold mb-2">Step 3. Directing</div>
          <p className="text-sm text-muted-foreground">나만의 시스템 구축</p>
        </div>
      </div>

      {/* Course Grid */}
      {lectures.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture: any) => (
            <LectureCard
              key={lecture._id}
              title={lecture.title}
              description={lecture.description}
              level={lecture.level}
              duration={lecture.duration}
              price={lecture.price || 'Free'}
              isLocked={lecture.isLocked ?? true}
              href={lecture.href || `/lectures/${lecture.slug?.current || lecture._id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-xl bg-secondary/20">
          <p className="text-muted-foreground">등록된 강의가 없습니다. Studio에서 추가해주세요.</p>
        </div>
      )}
    </div>
  )
}
