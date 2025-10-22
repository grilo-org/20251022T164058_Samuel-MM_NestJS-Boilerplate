import { Injectable } from '@nestjs/common';
import { scrypt as _scrypt, timingSafeEqual, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { HashProvider } from '@/shared/application/providers/hash-provider';

const scrypt = promisify(_scrypt);

@Injectable()
export class CryptoHashProvider implements HashProvider {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = (await scrypt(plain, salt, 32)) as Buffer;
    return `${salt.toString('hex')}:${derived.toString('hex')}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const [saltHex, digestHex] = hash.split(':');
    if (!saltHex || !digestHex) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const derived = (await scrypt(plain, salt, 32)) as Buffer;
    const digest = Buffer.from(digestHex, 'hex');
    return timingSafeEqual(derived, digest);
  }
}
