import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContextHolder } from "src/security/contextHolder";
import { RequestInterceptor } from "src/security/interceptor";
import { ServiceModule } from "src/service/service.module";
import { UsuarioNfe } from "src/usuario/usuarioNfe.entity";
import { NfeController } from "./nfe.controller";
import { Nfe } from "./nfe.entity";
import { NfeService } from "./nfe.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Nfe, UsuarioNfe]),
        ServiceModule
    ],
    controllers: [NfeController],
    providers: [
        NfeService,
        ContextHolder,
        {
            scope: Scope.REQUEST,
            provide: APP_INTERCEPTOR,
            useClass: RequestInterceptor,
        },
    ],
    exports: [NfeService]
})
export class NfeModule { }