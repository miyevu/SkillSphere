import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  hashPassword,
  signSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  isGctuEmail,
} from '@/lib/auth';
import { notifyAllAdmins } from '@/lib/api-notify';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, role } = await req.json();

    if (!fullName?.trim() || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isGctuEmail(email)) {
      return NextResponse.json(
        { error: 'Please use your GCTU email address (@live.gctu.edu.gh)' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedRole = String(role).toUpperCase() === 'LECTURER' ? 'LECTURER' : 'STUDENT';
    const status = normalizedRole === 'LECTURER' ? 'PENDING_APPROVAL' : 'ACTIVE';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { fullName: fullName.trim(), email, passwordHash, role: normalizedRole, status },
    });

    const safeUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role, status: user.status };

    if (status === 'PENDING_APPROVAL') {
      await notifyAllAdmins({
        type: 'lecturer_signup',
        title: 'New lecturer signup',
        message: `${user.fullName} (${user.email}) signed up as a lecturer and needs approval.`,
        link: '/admin/dashboard',
      });
      return NextResponse.json({ user: safeUser, pendingApproval: true });
    }

    const token = await signSession({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ user: safeUser, pendingApproval: false });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return res;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Sign up failed. Please try again.' }, { status: 500 });
  }
}