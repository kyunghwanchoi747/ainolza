import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { systemPrompt: string; userQuery: string; jsonMode: boolean };
    const { systemPrompt, userQuery, jsonMode } = body;

    // Cloudflare Workers AI 환경인지 확인
    const env = (process.env as any).__env;

    // 로컬 개발환경: Gemini API 사용
    if (!env?.AI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
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
    }

    // 프로덕션: Cloudflare Workers AI 사용
    const fullPrompt = jsonMode
      ? `${systemPrompt}\n\n${userQuery}\n\n반드시 JSON 형식으로만 응답하세요: {"score": 숫자, "feedback": "문자열"}`
      : `${systemPrompt}\n\n${userQuery}`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: jsonMode ? `${userQuery}\n\n반드시 JSON 형식으로만 응답하세요: {"score": 숫자, "feedback": "문자열"}` : userQuery },
      ],
      max_tokens: 1024,
    });

    const resultText = aiResponse.response;
    if (!resultText) {
      return NextResponse.json({ error: 'Empty response from Workers AI' }, { status: 500 });
    }

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
