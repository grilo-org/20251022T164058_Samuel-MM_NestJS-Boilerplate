import { ApiProperty } from '@nestjs/swagger';

export class AuthPresenter {
  @ApiProperty()
  accessToken!: string;

  static from(output: { accessToken: string }): AuthPresenter {
    const p = new AuthPresenter();
    p.accessToken = output.accessToken;
    return p;
  }
}
