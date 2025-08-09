import { LeadStage, LeadTemperature, TrackingEventType } from '@prisma/client';

export interface TemperatureInput {
  stage: LeadStage;
  engagementScore: number; // 0-100
  sourceQuality: number; // 0-100
  daysSinceEngagement: number;
}

export function computeTemperature(input: TemperatureInput): LeadTemperature {
  const stageWeight: Record<LeadStage, number> = {
    Lead: 0,
    Interested: 10,
    Applied: 25,
    Accepted: 35,
    Deposited: 45,
    Matriculated: 60
  };

  const score = Math.max(
    0,
    stageWeight[input.stage] +
      input.engagementScore +
      input.sourceQuality -
      input.daysSinceEngagement * 2
  );

  if (score >= 60) return 'Hot';
  if (score >= 25) return 'Warm';
  return 'Cold';
}

export function temperatureFromEvents(stage: LeadStage, events: TrackingEventType[], daysSince: number): LeadTemperature {
  let engagement = 0;
  if (events.includes('page_view')) engagement += 10;
  if (events.includes('form_submit')) engagement += 20;
  if (events.includes('email_reply')) engagement += 20;
  if (events.includes('sms_reply')) engagement += 25;
  return computeTemperature({ stage, engagementScore: engagement, sourceQuality: 0, daysSinceEngagement: daysSince });
}
