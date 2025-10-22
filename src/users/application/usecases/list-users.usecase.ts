import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/users/domain/users.repository';
import { UseCase } from '@/shared/application/usecases/use-case';
import type { PaginationOutput } from '@/shared/application/dtos/pagination-output';
import type { UserModel } from '@/users/domain/user.model';
import type { ListUsersQueryDto } from '@/users/application/dto/list-users.query';
import {
  buildMeta,
  normalizePaginationQuery,
} from '@/shared/application/utils/pagination';

@Injectable()
export class ListUsersUseCase
  implements UseCase<ListUsersQueryDto | void, PaginationOutput<UserModel>>
{
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    query?: ListUsersQueryDto,
  ): Promise<PaginationOutput<UserModel>> {
    const { page, pageSize, sort, sortDir } = normalizePaginationQuery(query);
    const filters = { name: query?.name, email: query?.email };
    const { data, total } = await this.usersRepository.findAll({
      page,
      pageSize,
      sort,
      sortDir,
      filters,
    });
    return { data, meta: buildMeta(total, page, pageSize) };
  }
}
