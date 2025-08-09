import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { formSubmissionSchema } from '@/lib/validators/form';
import { ApiError, errorResponse } from '@/lib/error';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json();
  const data = formSubmissionSchema.parse(json);
  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form) return errorResponse(new ApiError(404, 'not_found', 'Form not found'));
  const submission = await prisma.submission.create({
    data: {
      formId: form.id,
      payload: data.payload,
      matchedBy: data.email ? 'email' : 'none'
    }
  });
  if (data.email) {
    const program = data.programOfInterestId || (await prisma.program.findFirst())?.id;
    if (!program) throw new Error('No program configured');
    await prisma.lead.upsert({
      where: { email: data.email },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        programOfInterestId: program,
        consentEmail: data.consentEmail ?? false,
        consentSms: data.consentSms ?? false
      },
      create: {
        firstName: data.firstName || 'Unknown',
        lastName: data.lastName || 'Unknown',
        email: data.email,
        programOfInterestId: program,
        consentEmail: data.consentEmail ?? false,
        consentSms: data.consentSms ?? false
      }
    });
  }
  return Response.json({ id: submission.id });
}
