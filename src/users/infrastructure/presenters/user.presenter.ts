import { ApiProperty } from '@nestjs/swagger';
import type { UserModel } from '@/users/domain/user.model';

export class UserPresenter {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromModel(model: UserModel): UserPresenter {
    const userPresenter = new UserPresenter();
    userPresenter.id = model.id!;
    userPresenter.name = model.name;
    userPresenter.email = model.email;
    userPresenter.createdAt = model.createdAt!;
    userPresenter.updatedAt = model.updatedAt!;
    return userPresenter;
  }
}

export class UserCollectionPresenter {
  static fromPagination(
    this: void,
    output: {
      data: UserModel[];
      meta: {
        total: number;
        currentPage: number;
        lastPage: number;
        pageSize: number;
      };
    },
  ) {
    return {
      data: output.data.map((user) => UserPresenter.fromModel(user)),
      meta: output.meta,
    };
  }
}
