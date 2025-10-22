import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UsersRepository } from '@/users/domain/users.repository';
import type { HashProvider } from '@/shared/application/providers/hash-provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider') private readonly hashProvider: HashProvider,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await this.hashProvider.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    return user;
  }

  async login(userId: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    return { accessToken };
  }
}
