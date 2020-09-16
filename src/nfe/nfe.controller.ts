import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Query } from "@nestjs/common";
import { ContextHolder } from "src/security/contextHolder";
import { NfeAcreService } from "src/service/nfeAcre.service";
import { UpdateResult } from "typeorm";
import { Nfe } from "./nfe.entity";
import { NfeService } from "./nfe.service";
import { BuscaNfeDto } from "./validator/buscaNfeDto";
import { EditarNfeDto } from "./validator/editarNfeDto";

/**
 * Classe responsável por controlar as requisições referentes as Nfe's
 */
@Controller("nfe")
export class NfeController {
    constructor(
        private readonly nfeService: NfeService,
        private readonly nfeAcreService: NfeAcreService,
        private readonly contextHolder: ContextHolder
    ) { }

    /**
     * Escaneia os dados da NFE e salva no banco de dados
     * @param query - Url da nota fiscal
     */
    @Get("buscar")
    async crawler(@Query() query: BuscaNfeDto): Promise<Nfe> {
        const find = await this.nfeService.findByUserIdAndUrl(query.url, this.contextHolder.tokenId);
        
        if (find) {
            throw new HttpException("Nota fiscal já escaneada", HttpStatus.FORBIDDEN);
        }

        const nfe = await this.nfeAcreService.crawler(query.url);
        return this.nfeService.save(nfe, this.contextHolder.tokenId);
    }

    /**
     * Retorna uma lista de NFE pelo nome do produto
     * @param term Nome do produto
     */
    @Get("produto/nome/:term")
    findAllByProdutoName(@Param("term") term: string): Promise<Nfe[]> {
        return this.nfeService.findAllByProdutoName(term);
    }

    /**
     * Atualiza a NFE
     * @param editarNfeDto Nfe
     */
    @Put()
    update(@Body() editarNfeDto: EditarNfeDto) {
        return this.nfeService.update(editarNfeDto);
    }

    /**
     * Remove uma NFE pelo código de identificação
     * @param id Código da NFE
     */
    @Delete(":id")
    delete(@Param("id") id: number): Promise<UpdateResult> {
        return this.nfeService.delete(id);
    }
}