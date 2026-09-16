import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const listing = await prisma.serviceListing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  const { packageId } = await req.json();
  const packages = listing.packages as Array<{ id: string; name: string; price: number; deliveryDays: number; description: string }>;
  const pkg = packages.find((p) => p.id === packageId);
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 400 });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + pkg.deliveryDays);
  const deliveryDateStr = deliveryDate.toISOString().slice(0, 10);

  const project = await prisma.project.create({
    data: {
      title: `${listing.title} (${pkg.name})`,
      clientId: user.id,
      freelancerId: listing.userId,
      agreedPrice: pkg.price,
      deliveryDate: deliveryDateStr,
      scope: pkg.description,
      milestones: [{ id: crypto.randomUUID(), title: 'Final Delivery', dueDate: deliveryDateStr, status: 'pending', deliverableLink: '' }],
      sourceType: 'service',
      sourceListingId: listing.id,
    },
  });

  await createNotification({
    recipientId: listing.userId,
    type: 'hired',
    title: "You've been hired!",
    message: `${user.fullName} hired you for "${listing.title}" (${pkg.name}).`,
    link: `/marketplace/projects/${project.id}`,
  });

  return NextResponse.json({ project });
}