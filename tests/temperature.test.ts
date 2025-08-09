import { computeTemperature } from '../lib/temperature';
import { LeadStage } from '@prisma/client';

test('temperature calculation', () => {
  const temp = computeTemperature({ stage: LeadStage.Applied, engagementScore: 20, sourceQuality: 10, daysSinceEngagement: 1 });
  expect(temp).toBe('Warm');
});
