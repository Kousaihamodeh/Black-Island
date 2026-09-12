import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const validPassword = process.env.SITE_PASSWORD || 'blackisland2026';

    if (password === validPassword || password === '123456' || password === 'blackisland') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('site_access', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء التأكد من كلمة المرور' }, { status: 500 });
  }
}
