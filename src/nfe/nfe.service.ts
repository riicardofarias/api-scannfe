import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nfe } from 'src/nfe/nfe.entity';
import { UsuarioNfe } from 'src/usuario/usuarioNfe.entity';
import { extractKeyword } from 'src/util/keyword';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { EditarNfeDto } from './validator/editarNfeDto';

/**
 * Classe responsável por armazenar e retornar os dados referentes as notas fiscais
 */
@Injectable()
export class NfeService {

    constructor(
        @InjectRepository(Nfe)
        private nfeRepository: Repository<Nfe>,
        private connection: Connection
    ) { }

    /**
     * Retorna uma nota fiscal pela URL e código do usuário
     * @param url Url da nota fiscal
     * @param idUsuario Código do usuário
     */
    findByUserIdAndUrl(url: string, idUsuario: number): Promise<Nfe> {
        return this.nfeRepository.createQueryBuilder("nfe")
            .innerJoin(query => query.from(UsuarioNfe, "un").select("*"), "un", "un.id_nota_fiscal = nfe.id")
            .where("un.id_usuario = :idUsuario", { idUsuario: idUsuario })
            .andWhere("nfe.excluido IS false")
            .andWhere("nfe.url like :term", { term: `${url}%` })
        .getOne();
    }

    /**
     * Retorna todas as notas fiscais que contenham um produto específico
     * @param nome Nome do produto
     */
    findAllByProdutoName(nome: string): Promise<Nfe[]> {
        const keyWord = extractKeyword(nome);
        
        return this.nfeRepository.createQueryBuilder("nfe")
            .leftJoinAndSelect("nfe.categoria", "categoria")
            .leftJoinAndSelect("nfe.produtos", "produtos")
            .where("UPPER(produtos.nome) REGEXP UPPER(:nome)", { nome: keyWord })
            .andWhere("nfe.latitude IS NOT null")
            .andWhere("nfe.longitude IS NOT null")
            .groupBy("nfe.razao_social")
        .getMany();
    }

    /**
     * Retorna todas as notas fiscais pelo código de usuário
     * @param idUsuario Código do usuário
     */
    findAllByUserId(idUsuario: number): Promise<Nfe[]> {
        return this.nfeRepository.createQueryBuilder("nfe")
            .leftJoinAndSelect("nfe.categoria", "categoria")
            .leftJoinAndSelect("nfe.produtos", "produtos")
            .innerJoin(query => query.from(UsuarioNfe, "un").select("*"), "un", "un.id_nota_fiscal = nfe.id")
            .where("un.id_usuario = :idUsuario", { idUsuario: idUsuario })
            .andWhere("nfe.excluido IS false")
            .orderBy("nfe.data", "DESC")
            .getMany();
    }

    /**
     * Registra uma nova nota fiscal
     * @param nfe Nfe
     * @param userId Código do usuário
     */
    async save(nfe: Nfe, userId: number): Promise<Nfe> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const nota = await queryRunner.manager.save<Nfe>(nfe);
            
            await queryRunner.manager.save(nota.produtos.map(it => {
                it.idNotalFiscal = nota.id;
                return it;
            }));
            
            await queryRunner.manager.save<UsuarioNfe>(new UsuarioNfe({
                id: null,
                usuario: null,
                nfe: null,
                idNotaFiscal: nota.id,
                idUsuario: 1
            }));

            await queryRunner.commitTransaction();
            return nota;
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Atualiza os dados da nota fiscal
     * @param nfe Nfe
     */
    update(nfe: Nfe | EditarNfeDto): Promise<UpdateResult> {
        return this.nfeRepository.update({ id: nfe.id }, nfe);
    }

    /**
     * Remove a nota fiscal pelo código de identificação
     * @param id Código da nota fiscal
     */
    delete(id: number): Promise<UpdateResult> {
        return this.nfeRepository.update({ id: id }, { excluido: true });
    }
}
