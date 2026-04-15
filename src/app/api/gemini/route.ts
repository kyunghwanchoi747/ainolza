import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

// LLM 응답에서 순수 JSON만 추출 (마크다운 코드블록 제거)
function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0].trim();
  return text.trim();
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { allowed } = rateLimit(`gemini:${ip}`, 20, 60000); // 분당 20회
  if (!allowed) {
    return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
  }

  try {
    const body = await request.json() as { systemPrompt: string; userQuery: string; jsonMode: boolean };
    const { systemPrompt, userQuery, jsonMode } = body;

    if (!systemPrompt || !userQuery) {
      return NextResponse.json({ error: 'systemPrompt와 userQuery는 필수입니다.' }, { status: 400 });
    }

    // 1차: Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload: Record<string, unknown> = {
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        if (jsonMode) {
          payload.generationConfig = {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                score: { type: 'INTEGER' },
                feedback: { type: 'STRING' },
                rubric: {
                  type: 'OBJECT',
                  properties: {
                    subject: { type: 'INTEGER' },
                    color_quantity: { type: 'INTEGER' },
                    location: { type: 'INTEGER' },
                    detail: { type: 'INTEGER' },
                  },
                  required: ['subject', 'color_quantity', 'location', 'detail'],
                },
              },
              required: ['score', 'feedback', 'rubric'],
            },
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Gemini] API 오류 ${response.status}:`, errorText);
          // 오류 로그 후 Gemma fallback으로 진행
        } else {
          const data = await response.json() as Record<string, unknown>;
          const candidates = data.candidates as Array<{ content: { parts: Array<{ text?: string }> } }> | undefined;
          const resultText = candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') ?? '';
          if (resultText) {
            return NextResponse.json({ result: resultText });
          }
        }
      } catch (e) {
        console.error('[Gemini] 네트워크 오류:', (e as Error).message);
      }
    }

    // 2차 fallback: Cloudflare Workers AI (Gemma 3)
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      const ai = (env as unknown as Record<string, unknown>).AI;
      if (ai) {
        const aiBinding = ai as { run: (model: string, input: Record<string, unknown>) => Promise<{ response: string }> };
        const aiResponse = await aiBinding.run('@cf/google/gemma-3-12b-it', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: jsonMode
              ? `${userQuery}\n\n반드시 JSON 형식으로만 응답하세요. 마크다운이나 설명 없이 JSON만: {"score": 숫자, "feedback": "문자열", "rubric": {"subject": 숫자, "color_quantity": 숫자, "location": 숫자, "detail": 숫자}}`
              : userQuery
            },
          ],
          max_tokens: 1024,
        });

        let resultText = aiResponse.response;
        if (resultText) {
          // jsonMode일 때 마크다운 코드블록 등 불필요한 텍스트 제거
          if (jsonMode) {
            resultText = extractJson(resultText);
            try {
              JSON.parse(resultText); // 유효한 JSON인지 검증
            } catch {
              console.error('[Gemma] JSON 파싱 실패:', resultText);
              return NextResponse.json({ error: 'AI 응답을 JSON으로 변환할 수 없습니다.' }, { status: 500 });
            }
          }
          return NextResponse.json({ result: resultText });
        }
      }
    } catch (e) {
      console.error('[Gemma] Workers AI 오류:', (e as Error).message);
    }

    return NextResponse.json({ error: 'No AI backend available' }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
