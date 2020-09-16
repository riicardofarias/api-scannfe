import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProdutoController } from "./produto.controller";
import { Produto } from "./produto.entity";
import { ProdutoService } from "./produto.service";

@Module({
    imports: [TypeOrmModule.forFeature([Produto])],
    controllers: [ProdutoController],
    providers: [ProdutoService]
})
export class ProdutoModule { }