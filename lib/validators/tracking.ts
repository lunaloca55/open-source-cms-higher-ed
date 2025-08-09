import { z } from 'zod';
import { TrackingEventType } from '@prisma/client';

export const trackingEventSchema = z.object({
  e: z.nativeEnum(TrackingEventType),
  m: z.record(z.any()).optional(),
  ts: z.number()
});

export const trackingBatchSchema = z.array(trackingEventSchema).max(50);
