import { Column, Entity, Unique } from 'typeorm';
import { BaseTypeormEntity } from '@/shared/infrastructure/persistence/base.typeorm.entity';

@Entity('users')
@Unique(['email'])
export class UserTypeormEntity extends BaseTypeormEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 100, select: false })
  passwordHash!: string;
}
