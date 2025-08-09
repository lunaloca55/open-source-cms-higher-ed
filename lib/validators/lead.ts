import { z } from 'zod';
import { LeadStage, LeadTemperature } from '@prisma/client';

export const createLeadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  programOfInterestId: z.string().uuid(),
  stage: z.nativeEnum(LeadStage).optional(),
  temperature: z.nativeEnum(LeadTemperature).optional(),
  consentEmail: z.boolean(),
  consentSms: z.boolean()
});

export const updateLeadSchema = createLeadSchema.partial();
export const leadQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional()
});
