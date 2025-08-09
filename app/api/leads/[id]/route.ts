import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiError, errorResponse } from '@/lib/error';
import { updateLeadSchema } from '@/lib/validators/lead';
import { assertTransition } from '@/lib/stage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(new ApiError(401, 'unauthorized', 'Unauthorized'));
  if (!requireRole(session, ['Admin', 'EnrollmentSpecialist', 'Analyst']))
    return errorResponse(new ApiError(403, 'forbidden', 'Forbidden'));
  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return errorResponse(new ApiError(404, 'not_found', 'Lead not found'));
  return Response.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(new ApiError(401, 'unauthorized', 'Unauthorized'));
  if (!requireRole(session, ['Admin', 'EnrollmentSpecialist']))
    return errorResponse(new ApiError(403, 'forbidden', 'Forbidden'));
  const json = await req.json();
  const data = updateLeadSchema.parse(json);
  try {
    if (data.stage) {
      const current = await prisma.lead.findUnique({ where: { id: params.id }, select: { stage: true } });
      if (current && current.stage !== data.stage) assertTransition(current.stage, data.stage);
    }
    const lead = await prisma.lead.update({ where: { id: params.id }, data });
    return Response.json(lead);
  } catch (e: any) {
    return errorResponse(new ApiError(400, 'bad_request', e.message));
  }
}
