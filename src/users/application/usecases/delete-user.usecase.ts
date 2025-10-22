import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/users/domain/users.repository';
import { UseCase } from '@/shared/application/usecases/use-case';
import { NotFoundError } from '@/shared/domain/errors/domain-errors';

type Input = { id: string };

@Injectable()
export class DeleteUserUseCase implements UseCase<Input, void> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const user = await this.usersRepository.findById(input.id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
    await this.usersRepository.remove(user.id!);
  }
}
