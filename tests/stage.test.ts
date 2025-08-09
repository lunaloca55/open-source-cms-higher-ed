import { canTransition } from '../lib/stage';
import { LeadStage } from '@prisma/client';

test('valid transition', () => {
  expect(canTransition(LeadStage.Lead, LeadStage.Interested)).toBe(true);
});

test('invalid transition', () => {
  expect(canTransition(LeadStage.Lead, LeadStage.Accepted)).toBe(false);
});
