export abstract class BaseModel {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  protected constructor(props?: Partial<BaseModel>) {
    this.id = props?.id;
    this.createdAt = props?.createdAt;
    this.updatedAt = props?.updatedAt;
  }
}
