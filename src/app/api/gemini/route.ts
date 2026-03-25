import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { systemPrompt: string; userQuery: string; jsonMode: boolean };
    const { systemPrompt, userQuery, jsonMode } = body;

    // Cloudflare Workers AI 시도
    try {
      const { env } = await getCloudflareContext({ async: true });
      if ((env as any).AI) {
        const aiResponse = await (env as any).AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: jsonMode ? `${userQuery}\n\n반드시 JSON 형식으로만 응답하세요: {"score": 숫자, "feedback": "문자열"}` : userQuery },
          ],
          max_tokens: 1024,
        });

        const resultText = aiResponse.response;
        if (resultText) {
          return NextResponse.json({ result: resultText });
        }
      }
    } catch {
      // Workers AI 사용 불가 → Gemini fallback
    }

    // Fallback: Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'No AI backend available' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload: any = {
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
          },
          required: ['score', 'feedback'],
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
      return NextResponse.json({ error: `Gemini API error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json() as any;
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      return NextResponse.json({ error: 'Empty response' }, { status: 500 });
    }
    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
