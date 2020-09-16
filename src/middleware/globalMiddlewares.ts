import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as compression from 'compression';
import { AllExceptionsFilter } from "src/errors/allExceptionFilter";
import { RequestInterceptor } from "src/security/interceptor";


export async function globalMiddlewares(app: INestApplication) {
    app.use(compression());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));
    app.useGlobalInterceptors(new RequestInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new AllExceptionsFilter());
}