import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from "fs";
import { Categoria } from './categoria.entity';
import { CategoriaService } from './categoria.service';

/**
 * Classe responsável por controlar as requisições referentes a categoria
 */
@Controller("categoria")
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) { }

    /**
     * Retorna todas as categorias
     */
    @Get()
    findAll(): Promise<Categoria[]> {
        return this.categoriaService.findAll();
    }

    /**
     * Retorna o ícone da categoria
     * @param id Código da categoria
     */
    @Get(":id/img")
    img(@Param("id") id: number, @Res() response: Response): any {
        try {
            const file = fs.readFileSync(`${__dirname}/../../src/assets/icon/${id}.png`);
            response.setHeader('Content-Type', 'image/png;charset=UTF-8');
            response.send(file);
        } catch (error) {
            throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
