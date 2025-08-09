import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiError, errorResponse } from '@/lib/error';
import { createFormSchema } from '@/lib/validators/form';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(new ApiError(401, 'unauthorized', 'Unauthorized'));
  if (!requireRole(session, ['Admin'])) return errorResponse(new ApiError(403, 'forbidden', 'Forbidden'));
  const data = createFormSchema.parse(await req.json());
  const form = await prisma.form.create({
    data: {
      name: data.name,
      slug: data.slug,
      fields: {
        create: data.fields.map(f => ({
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required ?? false,
          mapToLeadField: f.mapToLeadField
        }))
      }
    },
    include: { fields: true }
  });
  return Response.json(form, { status: 201 });
}
