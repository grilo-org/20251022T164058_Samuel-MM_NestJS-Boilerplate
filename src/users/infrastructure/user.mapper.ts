import { UserModel } from '@/users/domain/user.model';
import { UserTypeormEntity } from '@/users/infrastructure/persistence/user.typeorm.entity';

export class UserMapper {
  static toDomain(entity: UserTypeormEntity): UserModel {
    return new UserModel({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toEntity(model: UserModel): UserTypeormEntity {
    const entity = new UserTypeormEntity();
    if (model.id) entity.id = model.id;
    entity.name = model.name;
    entity.email = model.email;
    entity.passwordHash = model.passwordHash;
    if (model.createdAt) entity.createdAt = model.createdAt;
    if (model.updatedAt) entity.updatedAt = model.updatedAt;
    return entity;
  }
}
