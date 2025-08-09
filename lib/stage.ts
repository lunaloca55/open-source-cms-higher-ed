import { LeadStage } from '@prisma/client';

const ORDER: LeadStage[] = ['Lead', 'Interested', 'Applied', 'Accepted', 'Deposited', 'Matriculated'];

export function canTransition(from: LeadStage, to: LeadStage): boolean {
  return ORDER.indexOf(to) - ORDER.indexOf(from) === 1;
}

export function assertTransition(from: LeadStage, to: LeadStage) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid stage transition from ${from} to ${to}`);
  }
}
