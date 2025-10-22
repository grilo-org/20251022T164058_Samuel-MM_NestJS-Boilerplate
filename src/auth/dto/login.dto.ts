import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty()
  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
  password!: string;
}
