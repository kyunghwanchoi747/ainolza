import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { systemPrompt: string; userQuery: string; jsonMode: boolean };
    const { systemPrompt, userQuery, jsonMode } = body;

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
                    background: { type: 'INTEGER' },
                    color: { type: 'INTEGER' },
                    mood: { type: 'INTEGER' },
                  },
                  required: ['subject', 'background', 'color', 'mood'],
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

        if (response.ok) {
          const data = await response.json() as Record<string, unknown>;
          const candidates = data.candidates as Array<{ content: { parts: Array<{ text: string }> } }> | undefined;
          const resultText = candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) {
            return NextResponse.json({ result: resultText });
          }
        }
      } catch {
        // Gemini 실패 → Workers AI fallback
      }
    }

    // 2차 fallback: Cloudflare Workers AI
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      const ai = (env as Record<string, unknown>).AI;
      if (ai) {
        const aiBinding = ai as { run: (model: string, input: Record<string, unknown>) => Promise<{ response: string }> };
        const aiResponse = await aiBinding.run('@cf/meta/llama-3.1-70b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: jsonMode ? `${userQuery}\n\n반드시 JSON 형식으로만 응답하세요: {"score": 숫자, "feedback": "문자열", "rubric": {"subject": 숫자, "background": 숫자, "color": 숫자, "mood": 숫자}}` : userQuery },
          ],
          max_tokens: 1024,
        });

        const resultText = aiResponse.response;
        if (resultText) {
          return NextResponse.json({ result: resultText });
        }
      }
    } catch {
      // Workers AI 사용 불가
    }

    return NextResponse.json({ error: 'No AI backend available' }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
