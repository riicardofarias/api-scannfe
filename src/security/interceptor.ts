import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ContextHolder } from './contextHolder';
import { validateJWT } from './jwtConfig';
import { isOpenRoute } from './openRouts';

/**
 * Classe responsável por controlar a autenticação de usuário
 */
@Injectable()
export class RequestInterceptor implements NestInterceptor {

    constructor(private contextHolder: ContextHolder) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        
        if (!isOpenRoute(request)) {
            const token = request.get("Authorization");
            if (!token) throw new HttpException("Token ausente", HttpStatus.UNAUTHORIZED);
            const tokenPayload = this.validateJWT(token);
            this.contextHolder.tokenId = tokenPayload.data;
        }

        return next.handle();
    }

    validateJWT(token: string): any {
        try {
            return validateJWT(token);
        } catch (error) {
            throw new HttpException(error.toString(), HttpStatus.FORBIDDEN);
        }
    }
}