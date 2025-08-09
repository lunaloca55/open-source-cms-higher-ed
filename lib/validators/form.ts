import { z } from 'zod';

export const formFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  mapToLeadField: z.string().optional()
});

export const createFormSchema = z.object({
  name: z.string(),
  slug: z.string(),
  fields: z.array(formFieldSchema)
});

export const formSubmissionSchema = z.object({
  payload: z.record(z.any()),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  programOfInterestId: z.string().uuid().optional(),
  consentEmail: z.boolean().optional(),
  consentSms: z.boolean().optional()
});
