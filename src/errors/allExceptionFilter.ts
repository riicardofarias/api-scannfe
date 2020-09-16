import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import * as winston from "winston";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    private logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: './src/logs/erros.log' }),
        ]
    });

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? typeof exception.getResponse() != "string" && exception.getResponse()['message'] ? exception.getResponse()['message'] : exception.getResponse()
            : exception;

        const exceptionResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message
        }

        response.status(status).json(exceptionResponse);
        this.logger.log("info", JSON.stringify(exceptionResponse));
    }
}