import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSession, SESSION_COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'PENDING_APPROVAL') {
      return NextResponse.json(
        { error: 'Your lecturer account is pending admin approval. Please check back later.' },
        { status: 403 }
      );
    }
    if (user.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'Your lecturer application was not approved. Contact an administrator.' },
        { status: 403 }
      );
    }
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Your account has been suspended. Contact an administrator.' },
        { status: 403 }
      );
    }

    const token = await signSession({ userId: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, status: user.status },
    });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}