import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypeormEntity } from './persistence/user.typeorm.entity';
import {
  CreateUserProps,
  UpdateUserProps,
  UsersRepository,
} from '../domain/users.repository';
import { UserMapper } from './user.mapper';
import type { UserModel } from '../domain/user.model';
import type { NormalizedSearchParams } from '@/shared/application/dtos/search-input';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly repo: Repository<UserTypeormEntity>,
  ) {}

  async create(data: CreateUserProps): Promise<UserModel> {
    const entity: UserTypeormEntity = this.repo.create(
      data as Partial<UserTypeormEntity>,
    );
    const saved = await this.repo.save<UserTypeormEntity>(entity);
    return UserMapper.toDomain(saved);
  }

  async findAll(
    params: NormalizedSearchParams & {
      filters?: { name?: string; email?: string };
    },
  ): Promise<{ data: UserModel[]; total: number }> {
    const { page, pageSize, sortDir } = params;
    const allowedSort = new Set(['createdAt', 'updatedAt', 'name', 'email']);
    const sort = allowedSort.has(params.sort) ? params.sort : 'createdAt';
    const qb = this.repo.createQueryBuilder('u');
    if (params?.filters?.name) {
      qb.andWhere('LOWER(u.name) LIKE :name', {
        name: `%${params.filters.name.toLowerCase()}%`,
      });
    }
    if (params?.filters?.email) {
      qb.andWhere('LOWER(u.email) LIKE :email', {
        email: `%${params.filters.email.toLowerCase()}%`,
      });
    }
    qb.orderBy(`u.${sort}`, sortDir.toUpperCase() as 'ASC' | 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);
    const [rows, total] = await qb.getManyAndCount();
    return { data: rows.map((row) => UserMapper.toDomain(row)), total };
  }

  async findById(id: string): Promise<UserModel | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const row = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('LOWER(u.email) = LOWER(:email)', { email })
      .getOne();
    return row ? UserMapper.toDomain(row) : null;
  }

  async update(id: string, data: UpdateUserProps): Promise<UserModel> {
    await this.repo.update({ id }, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Usuário não encontrado');
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
