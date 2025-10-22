import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
          ],
          censor: '[Redacted]',
        },
        genReqId: (req) =>
          req.headers['x-request-id']?.toString() ?? randomUUID(),
        customProps: (req) => ({ requestId: (req as any).id }),
        customLogLevel: (_req, res, err) => {
          const code = (res as any)?.statusCode ?? 0;
          if (err || code >= 500) return 'error';
          if (code >= 400) return 'warn';
          return 'info';
        },
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
