import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListUsersQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page deve ser número inteiro' })
  @Min(1, { message: 'page deve ser no mínimo 1' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize deve ser número inteiro' })
  @Min(1, { message: 'pageSize deve ser no mínimo 1' })
  @Max(100, { message: 'pageSize deve ser no máximo 100' })
  pageSize?: number = 10;

  @ApiPropertyOptional({ enum: ['name', 'email', 'createdAt'] })
  @IsOptional()
  @IsString()
  sort?: 'name' | 'email' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Filtro por nome' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtro por email' })
  @IsOptional()
  @IsString()
  email?: string;
}
