import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nfe } from 'src/nfe/nfe.entity';
import { extractKeyword } from 'src/util/keyword';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';

/**
 * Classe responsável por armazenar e retornar os dados referentes aos produtos
 */
@Injectable()
export class ProdutoService {

    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) { }

    /**
     * Retorna uma lista com todos os produtos encontrados pelo nome
     * @param nome Nome do produto
     */
    async findAllProdutoNomeByName(nome: string): Promise<string[]> {
        const keyWord = extractKeyword(nome);
        
        const result = await this.produtoRepository.createQueryBuilder("produto")
            .select("produto.nome")
            .innerJoin(query => query.from(Nfe, "nfe").select("*"), "nfe", "produto.id_nota_fiscal = nfe.id")
            .where("UPPER(produto.nome) REGEXP UPPER(:nome)", { nome: keyWord })
            .andWhere("nfe.latitude IS NOT null")
            .andWhere("nfe.longitude IS NOT null")
            .groupBy("produto.nome")
            .orderBy("produto.nome")
        .getMany();
        
        return result.map(it => it.nome);
    }
}
