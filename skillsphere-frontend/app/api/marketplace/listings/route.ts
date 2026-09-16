import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET() {
  const listings = await prisma.serviceListing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { fullName: true, email: true } } },
  });
  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const listing = await prisma.serviceListing.create({
    data: {
      userId: user.id,
      title: body.title,
      category: body.category || '',
      description: body.description || '',
      skills: body.skills || [],
      tools: body.tools || [],
      packages: body.packages || [],
      sampleLinks: body.sampleLinks || [],
      faqs: body.faqs || [],
      availability: body.availability || 'available',
      location: body.location || '',
      terms: body.terms || '',
    },
  });

  return NextResponse.json({ listing });
}