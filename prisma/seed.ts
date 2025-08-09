import { prisma } from '../lib/db';
import { hash } from 'bcryptjs';
import { LeadStage, LeadTemperature } from '@prisma/client';

async function main() {
  const programs = await prisma.program.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      name: `Program ${i + 1}`,
      code: `P${i + 1}`
    }))
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      role: 'Admin',
      passwordHash: await hash('password', 10)
    }
  });

  const specialists = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `spec${i + 1}@example.com`,
          role: 'EnrollmentSpecialist',
          passwordHash: await hash('password', 10)
        }
      })
    )
  );

  const programIds = (await prisma.program.findMany()).map(p => p.id);
  const specialistIds = specialists.map(s => s.id);

  for (let i = 0; i < 20; i++) {
    await prisma.lead.create({
      data: {
        firstName: `Lead${i}`,
        lastName: 'Test',
        email: `lead${i}@example.com`,
        programOfInterestId: programIds[i % programIds.length],
        stage: Object.values(LeadStage)[i % Object.values(LeadStage).length],
        temperature: Object.values(LeadTemperature)[i % Object.values(LeadTemperature).length],
        consentEmail: true,
        consentSms: true,
        ownerId: specialistIds[i % specialistIds.length]
      }
    });
  }

  console.log('Seed complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
