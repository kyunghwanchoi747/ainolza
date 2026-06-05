import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

/**
 * 이키가이 결과지 생성.
 *
 * 입력: 4축 답변 ({ love[], good_at[], world[], paid })
 * 출력: 결과지 JSON (summary, keywords[3], 4교집합, first_steps[3], closing)
 *
 * 모델 전략: Gemini 2.0 Flash → 실패 시 Cloudflare Workers AI (Gemma) fallback.
 * /api/gemini와 다른 스키마라 별도 라우트로 분리.
 *
 * 톤 원칙(프롬프트에 명시):
 *  - 거대한 천직 강요 X. 일본 본토 이키가이 정신(작은 기쁨, 일상의 의미).
 *  - 시니어를 포함한 전 연령. "직업" 명칭이 어색하면 "활동·역할·관계"로 풀어쓰기.
 *  - AI스러운 색감/이모지 금지. 텍스트만으로 의미 전달.
 */

type Answers = {
  love: string[]
  good_at: string[]
  world: string[]
  paid: string
}

const SYSTEM_PROMPT = `당신은 사용자가 이키가이(生き甲斐, 살아갈 보람)를 찾도록 돕는 카운슬러입니다.

이키가이의 본래 정신:
- 일본 본토의 이키가이는 "거대한 천직"이 아니라 "아침에 일어날 작은 이유"입니다.
- 미하라 미에코(1966)의 정의: 일상의 작은 보람, 누군가와의 관계, 몰입의 순간.
- 직업/돈은 필수 요소가 아닙니다. 시니어에게는 "직업"보다 "활동·역할·관계"가 자연스럽습니다.

서양식 4원 다이어그램의 4축:
- love (좋아하는 것)
- good_at (잘하는 것)
- world (세상이 필요로 하는 것)
- paid (돈으로 연결되는 것)

4 교집합:
- Passion (열정) = love + good_at
- Profession (직업) = good_at + paid
- Vocation (천직) = paid + world
- Mission (사명) = world + love

규칙:
1. 사용자의 4축 답변을 종합해서 결과지를 작성합니다.
2. 이모지를 사용하지 않습니다.
3. 자극적·과장된 표현 금지. 차분하고 다정한 톤.
4. "당신의 천직은 X입니다" 같은 단정 X. "X일 수도 있고, Y의 길도 보입니다" 식으로.
5. summary는 1~2 문장. "당신의 이키가이는 OO과 OO가 만나는 자리에 있습니다" 같은 느낌.
6. keywords는 정확히 3개. 짧은 한국어 명사구 (예: "가르치는 글쓰기", "조용한 돌봄").
7. 각 교집합(passion, profession, vocation, mission)은 title 1줄 + body 2~3문장.
8. first_steps는 정확히 3개. 이번 주에 실행 가능한 작고 구체적인 행동만. "강의 시작" 같은 거대한 결심 X.
9. closing은 2~3문장. 격려 + 일상의 작은 기쁨을 알아채는 데 대한 짧은 메시지.
10. paid가 "아직 모르겠어요"이거나 비어있으면, 1~3축 답으로부터 profession/vocation을 부드럽게 추정하되 강요하지 않습니다.

응답은 반드시 아래 JSON 스키마만:
{
  "summary": "...",
  "keywords": ["...", "...", "..."],
  "passion":    { "title": "...", "body": "..." },
  "profession": { "title": "...", "body": "..." },
  "vocation":   { "title": "...", "body": "..." },
  "mission":    { "title": "...", "body": "..." },
  "first_steps": ["...", "...", "..."],
  "closing": "..."
}`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    keywords: { type: 'ARRAY', items: { type: 'STRING' } },
    passion: {
      type: 'OBJECT',
      properties: { title: { type: 'STRING' }, body: { type: 'STRING' } },
      required: ['title', 'body'],
    },
    profession: {
      type: 'OBJECT',
      properties: { title: { type: 'STRING' }, body: { type: 'STRING' } },
      required: ['title', 'body'],
    },
    vocation: {
      type: 'OBJECT',
      properties: { title: { type: 'STRING' }, body: { type: 'STRING' } },
      required: ['title', 'body'],
    },
    mission: {
      type: 'OBJECT',
      properties: { title: { type: 'STRING' }, body: { type: 'STRING' } },
      required: ['title', 'body'],
    },
    first_steps: { type: 'ARRAY', items: { type: 'STRING' } },
    closing: { type: 'STRING' },
  },
  required: ['summary', 'keywords', 'passion', 'profession', 'vocation', 'mission', 'first_steps', 'closing'],
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) return fence[1].trim()
  const obj = text.match(/\{[\s\S]*\}/)
  if (obj) return obj[0].trim()
  return text.trim()
}

function buildUserQuery(a: Answers): string {
  const lines: string[] = []
  lines.push(`좋아하는 것: ${a.love.join(', ') || '(선택 없음)'}`)
  lines.push(`잘하는 것: ${a.good_at.join(', ') || '(선택 없음)'}`)
  lines.push(`세상이 필요로 하는 것: ${a.world.join(', ') || '(선택 없음)'}`)
  lines.push(`돈으로 연결되는 것: ${a.paid || '아직 모르겠음'}`)
  return lines.join('\n')
}

function validatePayload(p: any): boolean {
  if (!p || typeof p !== 'object') return false
  if (typeof p.summary !== 'string' || !p.summary) return false
  if (!Array.isArray(p.keywords) || p.keywords.length === 0) return false
  for (const k of ['passion', 'profession', 'vocation', 'mission']) {
    if (!p[k] || typeof p[k].title !== 'string' || typeof p[k].body !== 'string') return false
  }
  if (!Array.isArray(p.first_steps) || p.first_steps.length === 0) return false
  if (typeof p.closing !== 'string') return false
  return true
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const { allowed } = rateLimit(`ikigai:${ip}`, 10, 60000)
  if (!allowed) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 },
    )
  }

  let answers: Answers
  try {
    answers = (await request.json()) as Answers
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (!Array.isArray(answers.love) || answers.love.length === 0) {
    return NextResponse.json({ error: '좋아하는 것을 선택해주세요.' }, { status: 400 })
  }
  if (!Array.isArray(answers.good_at) || answers.good_at.length === 0) {
    return NextResponse.json({ error: '잘하는 것을 선택해주세요.' }, { status: 400 })
  }
  if (!Array.isArray(answers.world) || answers.world.length === 0) {
    return NextResponse.json({ error: '세상이 필요로 하는 것을 선택해주세요.' }, { status: 400 })
  }

  const userQuery = buildUserQuery(answers)

  // 1차 — Gemini
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as any
        const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ?? ''
        if (text) {
          try {
            const parsed = JSON.parse(text)
            if (validatePayload(parsed)) {
              return NextResponse.json(parsed)
            }
            console.error('[ikigai] gemini payload invalid', text.slice(0, 200))
          } catch (e) {
            console.error('[ikigai] gemini JSON parse fail', (e as Error).message)
          }
        }
      } else {
        const t = await res.text()
        console.error('[ikigai] gemini http', res.status, t.slice(0, 200))
      }
    } catch (e) {
      console.error('[ikigai] gemini threw', (e as Error).message)
    }
  }

  // 2차 — Workers AI Gemma fallback
  let gemmaDebug = 'not attempted'
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    const ai = (env as any).AI
    if (!ai) {
      gemmaDebug = 'no AI binding'
    } else {
      // Gemma 3 12B는 2026-05-30 단종. Gemma 4 26B(활성) 로 교체.
      gemmaDebug = 'calling gemma-4'
      const aiResponse = (await ai.run('@cf/google/gemma-4-26b-a4b-it', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `${userQuery}\n\n반드시 위 시스템 프롬프트의 JSON 스키마만 출력하세요. 마크다운/설명 금지.`,
          },
        ],
        max_tokens: 1500,
      })) as { response?: string }
      const text = aiResponse?.response || ''
      gemmaDebug = `gemma responded text.length=${text.length}`
      if (text) {
        const json = extractJson(text)
        try {
          const parsed = JSON.parse(json)
          if (validatePayload(parsed)) {
            return NextResponse.json(parsed)
          }
          gemmaDebug = `gemma payload invalid: ${json.slice(0, 120)}`
          console.error('[ikigai] gemma payload invalid', json.slice(0, 200))
        } catch (e) {
          gemmaDebug = `gemma JSON parse fail: ${(e as Error).message} text=${text.slice(0, 80)}`
          console.error('[ikigai] gemma JSON parse fail', (e as Error).message)
        }
      } else {
        gemmaDebug = 'gemma returned empty'
      }
    }
  } catch (e) {
    gemmaDebug = `gemma threw: ${(e as Error).message}`
    console.error('[ikigai] gemma threw', (e as Error).message)
  }

  // 디버그 정보를 응답에 임시 포함 (wrangler tail 메시지 잘림 우회).
  // 원인 확인 후 다음 커밋에서 제거.
  return NextResponse.json(
    { error: '결과를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.', debug: gemmaDebug },
    { status: 502 },
  )
}
