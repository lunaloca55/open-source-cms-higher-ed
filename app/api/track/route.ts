import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { trackingBatchSchema } from '@/lib/validators/tracking';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = trackingBatchSchema.parse(body);
  await prisma.trackingEvent.createMany({
    data: events.map(e => ({
      occurredAt: new Date(e.ts),
      event: e.e,
      meta: e.m
    }))
  });
  return Response.json({ ok: true });
}
