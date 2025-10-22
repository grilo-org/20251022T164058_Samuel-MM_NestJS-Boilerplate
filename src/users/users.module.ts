import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@/users/infrastructure/users.controller';
import { UserTypeormEntity } from '@/users/infrastructure/persistence/user.typeorm.entity';
import { TypeormUsersRepository } from '@/users/infrastructure/typeorm-users.repository';
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase';
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase';
import { FindUserUseCase } from '@/users/application/usecases/find-user.usecase';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase';
import { CryptoHashProvider } from '@/shared/infrastructure/providers/crypto-hash.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeormEntity])],
  controllers: [UsersController],
  providers: [
    { provide: 'UsersRepository', useClass: TypeormUsersRepository },
    { provide: 'HashProvider', useClass: CryptoHashProvider },
    CreateUserUseCase,
    ListUsersUseCase,
    FindUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: ['UsersRepository', 'HashProvider'],
})
export class UsersModule {}
