import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/users/domain/users.repository';
import { UseCase } from '@/shared/application/usecases/use-case';
import { CreateUserDto } from '@/users/application/dto/create-user.dto';
import type { HashProvider } from '@/shared/application/providers/hash-provider';
import { ConflictError } from '@/shared/domain/errors/domain-errors';

type Output = { id: string };

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, Output> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider') private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: CreateUserDto): Promise<Output> {
    const exists = await this.usersRepository.findByEmail(input.email);
    if (exists) throw new ConflictError('E-mail já cadastrado');
    const passwordHash = await this.hashProvider.hash(input.password);
    const user = await this.usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    return { id: user.id! };
  }
}
