import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiError, errorResponse } from '@/lib/error';
import { createLeadSchema, leadQuerySchema } from '@/lib/validators/lead';
import { LeadTemperature } from '@prisma/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(new ApiError(401, 'unauthorized', 'Unauthorized'));
  if (!requireRole(session, ['Admin', 'EnrollmentSpecialist']))
    return errorResponse(new ApiError(403, 'forbidden', 'Forbidden'));
  const json = await req.json();
  const data = createLeadSchema.parse(json);
  try {
    const lead = await prisma.lead.upsert({
      where: { email: data.email },
      update: data,
      create: data
    });
    return Response.json(lead, { status: 201 });
  } catch (e: any) {
    return errorResponse(new ApiError(400, 'bad_request', e.message));
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(new ApiError(401, 'unauthorized', 'Unauthorized'));
  if (!requireRole(session, ['Admin', 'EnrollmentSpecialist', 'Analyst']))
    return errorResponse(new ApiError(403, 'forbidden', 'Forbidden'));
  const query = leadQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const skip = (query.page - 1) * query.size;
  const where = query.search
    ? {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } }
        ]
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.lead.findMany({ skip, take: query.size, where, orderBy: { createdAt: 'desc' } }),
    prisma.lead.count({ where })
  ]);
  return Response.json({ items, total, page: query.page, size: query.size });
}
