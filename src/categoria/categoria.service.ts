import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';

/**
 * Classe responsável por armazenar e retornar os dados referentes as categorias
 */
@Injectable()
export class CategoriaService {

    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
    ) { }

    /**
     * Retorna uma lista com todas as categorias
     */
    findAll(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }
}
