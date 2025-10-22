import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '@/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/users/application/dto/update-user.dto';
import { Inject, Query } from '@nestjs/common';
import { ListUsersQueryDto } from '@/users/application/dto/list-users.query';
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase';
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase';
import { FindUserUseCase } from '@/users/application/usecases/find-user.usecase';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '@/users/infrastructure/presenters/user.presenter';
import type { UserModel } from '@/users/domain/user.model';
import type { PaginationOutput } from '@/shared/application/dtos/pagination-output';

@ApiTags('users')
@ApiExtraModels(UserPresenter)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private createUserUseCase: CreateUserUseCase;

  @Inject(ListUsersUseCase)
  private listUsersUseCase: ListUsersUseCase;

  @Inject(FindUserUseCase)
  private findUserUseCase: FindUserUseCase;

  @Inject(UpdateUserUseCase)
  private updateUserUseCase: UpdateUserUseCase;

  @Inject(DeleteUserUseCase)
  private deleteUserUseCase: DeleteUserUseCase;

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({
    description: 'Usuário criado',
    schema: {
      $ref: getSchemaPath(UserPresenter),
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: { type: 'string', example: 'Dados inválidos' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fields: { type: 'string', example: 'email' },
              messages: {
                type: 'array',
                items: { type: 'string', example: 'E-mail inválido' },
              },
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito (e-mail já cadastrado)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'E-mail já cadastrado' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase
      .execute(dto)
      .then((out: { id: string }) => ({ id: out.id }));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Lista paginada de usuários',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(UserPresenter) } },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            currentPage: { type: 'number' },
            lastPage: { type: 'number' },
            pageSize: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: { type: 'string', example: 'Dados inválidos' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async findAll(@Query() query: ListUsersQueryDto) {
    return this.listUsersUseCase
      .execute(query)
      .then((out: PaginationOutput<UserModel>) =>
        UserCollectionPresenter.fromPagination(out),
      );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Usuário por id',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.findUserUseCase
      .execute({ id })
      .then((user: UserModel) => UserPresenter.fromModel(user));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({
    description: 'Usuário atualizado',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: { type: 'string', example: 'Dados inválidos' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserUseCase
      .execute({ id, ...dto })
      .then((user: UserModel) => UserPresenter.fromModel(user));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiNoContentResponse({ description: 'Usuário removido' })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
