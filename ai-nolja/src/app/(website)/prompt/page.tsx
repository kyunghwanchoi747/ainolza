import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

const PROMPTS_QUERY = defineQuery(
  `*[_type == "tool" && category == "Prompt"] | order(_createdAt desc)`,
)

export default async function PromptPage() {
  const prompts = await sanityFetch({ query: PROMPTS_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          AI <span className="text-primary">Prompts</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          복사해서 바로 쓰는 마법의 주문들. 실전에서 검증된 프롬프트 라이브러리입니다.
        </p>
      </div>

      {prompts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt: any) => (
            <div key={prompt._id} className="border rounded-lg p-6 bg-card">
              <h3 className="font-bold text-xl mb-2">{prompt.name}</h3>
              <p className="text-sm text-muted-foreground">{prompt.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-xl bg-secondary/20">
          <p className="text-muted-foreground">프롬프트 템플릿이 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}
