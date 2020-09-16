import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModule } from './categoria/categoria.module';
import { NfeModule } from './nfe/nfe.module';
import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    CategoriaModule,
    ProdutoModule,
    NfeModule,
    UsuarioModule,
    TypeOrmModule.forRoot(),
  ]
})
export class AppModule { }
