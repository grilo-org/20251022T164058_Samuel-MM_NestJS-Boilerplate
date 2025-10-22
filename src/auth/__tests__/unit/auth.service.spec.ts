import { AuthService } from '../../auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  it('validates and returns jwt', async () => {
    const usersRepo = { findByEmail: jest.fn() } as any;
    const hashProvider = { compare: jest.fn(), hash: jest.fn() } as any;

    usersRepo.findByEmail.mockResolvedValue({
      id: 'u1',
      email: 'a@a.com',
      passwordHash: 'salt:123',
    });
    hashProvider.compare.mockResolvedValue(true);

    const service = new AuthService(
      new JwtService({ secret: 'test' }) as any,
      usersRepo,
      hashProvider,
    );

    const u = await service.validateUser('a@a.com', '123');
    expect(u?.id).toBe('u1');

    const token = await service.login('u1');
    expect(typeof token.accessToken).toBe('string');
  });
});
