import { POST } from '../app/api/forms/[id]/submit/route';

jest.mock('../lib/db', () => ({
  prisma: {
    form: { findUnique: jest.fn().mockResolvedValue({ id: 'form1' }) },
    submission: { create: jest.fn().mockResolvedValue({ id: 'sub1' }) },
    program: { findFirst: jest.fn().mockResolvedValue({ id: 'prog1' }) },
    lead: { upsert: jest.fn().mockResolvedValue({}) }
  }
}));

test('form submission creates lead', async () => {
  const req = new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ payload: {}, email: 'a@test.com', consentEmail: true, consentSms: true }),
    headers: { 'Content-Type': 'application/json' }
  }) as any;
  const res = await POST(req, { params: { id: 'form1' } });
  const json = await res.json();
  expect(json.id).toBe('sub1');
});
