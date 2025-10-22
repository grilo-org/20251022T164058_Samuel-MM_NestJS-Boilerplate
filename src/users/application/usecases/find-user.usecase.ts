import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/users/domain/users.repository';
import { UseCase } from '@/shared/application/usecases/use-case';
import { NotFoundError } from '@/shared/domain/errors/domain-errors';

type Input = { id: string };

@Injectable()
export class FindUserUseCase implements UseCase<Input, any> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: Input) {
    const user = await this.usersRepository.findById(input.id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
    return user;
  }
}
