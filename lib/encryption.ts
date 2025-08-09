import crypto from 'crypto';

const ALG = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || 'secret').digest();

export function encrypt(text: string): { value: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALG, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { value: encrypted.toString('hex'), iv: iv.toString('hex'), tag: tag.toString('hex') };
}

export function decrypt(data: { value: string; iv: string; tag: string }): string {
  const decipher = crypto.createDecipheriv(ALG, KEY, Buffer.from(data.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data.value, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}
