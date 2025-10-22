import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/users/domain/users.repository';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundError } from '@/shared/domain/errors/domain-errors';
import type { HashProvider } from '@/shared/application/providers/hash-provider';

type Input = { id: string } & UpdateUserDto;

@Injectable()
export class UpdateUserUseCase implements UseCase<Input, unknown> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider') private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: Input) {
    const user = await this.usersRepository.findById(input.id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
    const data: Partial<Pick<typeof user, 'name' | 'email' | 'passwordHash'>> =
      {};
    if (input.name) data.name = input.name;
    if (input.email) data.email = input.email;
    if (input.password) {
      data.passwordHash = await this.hashProvider.hash(input.password);
    }
    return this.usersRepository.update(user.id!, data);
  }
}
