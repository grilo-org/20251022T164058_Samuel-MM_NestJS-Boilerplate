import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty()
  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
  password!: string;
}
