import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NfeModule } from "src/nfe/nfe.module";
import { ContextHolder } from "src/security/contextHolder";
import { RequestInterceptor } from "src/security/interceptor";
import { ServiceModule } from "src/service/service.module";
import { UsuarioController } from "./usuario.controller";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        NfeModule,
        ServiceModule
    ],
    controllers: [UsuarioController],
    providers: [
        UsuarioService,
        ContextHolder,
        {
            scope: Scope.REQUEST,
            provide: APP_INTERCEPTOR,
            useClass: RequestInterceptor,
        },
    ],
    exports:[UsuarioService]
})
export class UsuarioModule { }