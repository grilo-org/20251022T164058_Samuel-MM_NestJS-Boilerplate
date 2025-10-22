import { UserModel } from '@/users/domain/user.model';
import type { NormalizedSearchParams } from '@/shared/application/dtos/search-input';

export type CreateUserProps = Pick<
  UserModel,
  'name' | 'email' | 'passwordHash'
>;
export type UpdateUserProps = Partial<
  Pick<UserModel, 'name' | 'email' | 'passwordHash'>
>;

export interface UsersRepository {
  create(data: CreateUserProps): Promise<UserModel>;
  findAll(
    params: NormalizedSearchParams & {
      filters?: { name?: string; email?: string };
    },
  ): Promise<{ data: UserModel[]; total: number }>;
  findById(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  update(id: string, data: UpdateUserProps): Promise<UserModel>;
  remove(id: string): Promise<void>;
}
