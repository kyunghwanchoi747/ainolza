import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';
import { sanitize, isValidEmail, isValidPhone } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string;
      phone: string;
      email: string;
      program: string;
      message?: string;
    };

    const name = sanitize(body.name);
    const phone = sanitize(body.phone);
    const email = sanitize(body.email);
    const program = sanitize(body.program);
    const message = sanitize(body.message);

    if (!name || !phone || !email) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: '올바른 연락처 형식이 아닙니다.' }, { status: 400 });
    }

    const payload = await getPayloadClient();

    // 중복 신청 체크
    const existing = await payload.find({
      collection: 'enrollments',
      where: {
        email: { equals: email },
        program: { equals: program || 'vibe-coding' },
        status: { not_equals: 'cancelled' },
      },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: '이미 해당 프로그램에 신청하셨습니다.' }, { status: 409 });
    }

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
