import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string;
      phone: string;
      email: string;
      program: string;
      message?: string;
    };

    const { name, phone, email, program, message } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
    }

    const payload = await getPayloadClient();

    await payload.create({
      collection: 'enrollments',
      data: {
        name,
        phone,
        email,
        program: program || 'vibe-coding',
        message: message || '',
        status: 'pending',
      },
    });

    return NextResponse.json({ ok: true, message: '신청이 접수되었습니다.' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
