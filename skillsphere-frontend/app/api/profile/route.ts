import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      photo: body.photo,
      programme: body.programme,
      department: body.department,
      level: body.level,
      institution: body.institution,
      bio: body.bio,
      skills: body.skills,
      availability: body.availability,
      preferredWorkType: body.preferredWorkType,
      location: body.location,
      timezone: body.timezone,
      externalLinks: body.externalLinks,
      visibility: body.visibility,
    },
    create: {
      userId: user.id,
      photo: body.photo ?? '🧑‍🎓',
      programme: body.programme ?? '',
      department: body.department ?? '',
      level: body.level ?? '',
      institution: body.institution ?? 'Ghana Communication Technology University (GCTU)',
      bio: body.bio ?? '',
      skills: body.skills ?? [],
      availability: body.availability ?? 'available',
      preferredWorkType: body.preferredWorkType ?? 'remote',
      location: body.location ?? '',
      timezone: body.timezone ?? '',
      externalLinks: body.externalLinks ?? [],
      visibility: body.visibility ?? 'institution',
    },
  });

  return NextResponse.json({ profile });
}