import { Controller, Get, Param } from "@nestjs/common";
import { ProdutoService } from "./produto.service";

/**
 * Classe responsável por controlar as requisições referentes aos produtos da NFE
 */
@Controller("produto")
export class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) { }

    /**
     * Retorna todos os produtos pelo nome
     * @param term Nome do produto
     */
    @Get("nome/:term")
    findAllProdutoNomeByName(@Param("term") term: string): Promise<string[]> {
        return this.produtoService.findAllProdutoNomeByName(term);
    }
}