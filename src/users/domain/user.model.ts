import { BaseModel } from '@/shared/domain/base.model';

export class UserModel extends BaseModel {
  name: string;
  email: string;
  passwordHash: string;

  constructor(props: {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
  }
}
