import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texto' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
  password?: string;
}
