import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  UnauthorizedDomainError,
} from '@/shared/domain/errors/domain-errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: {
      status: (code: number) => { json: (body: unknown) => void };
    } = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      // Log stack for visibility (do not expose in response)
      this.logger.error(exception.message, exception.stack);
      const body =
        typeof res === 'string'
          ? { message: res }
          : (res as Record<string, unknown>);
      response.status(status).json({
        statusCode: status,
        ...body,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof DomainError) {
      this.logger.warn(`[DomainError] ${exception.name}: ${exception.message}`);
      let status = HttpStatus.BAD_REQUEST;
      if (exception instanceof NotFoundError) status = HttpStatus.NOT_FOUND;
      if (exception instanceof ConflictError) status = HttpStatus.CONFLICT;
      if (exception instanceof UnauthorizedDomainError)
        status = HttpStatus.UNAUTHORIZED;
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unknown error', String(exception));
    }
    response.status(status).json({
      statusCode: status,
      message: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
    return;
  }
}
