import { Expose, Type } from "class-transformer";
import * as moment from "moment";
import { Categoria } from "src/categoria/categoria.entity";
import { Produto } from "src/produto/produto.entity";
import { mascaraReais } from "src/util/formatadorMoeda";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

/**
 * Representa a entidade de Nota Fiscal
 */
@Entity({ name: "nota_fiscal" })
export class Nfe {
    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @Column()
    url: string;

    @Column()
    nome: string;

    @Expose({ name: 'razao_social' })
    @Column({ name: 'razao_social' })
    razaoSocial: string;

    @Column()
    cnpj: string;

    @Column()
    endereco: string;

    @Expose({name: 'total_de_itens'})
    @Column({name: 'total_de_itens'})
    @Type(() => Number)
    totalItens: number;

    @Expose({name: 'valor_pago'})
    @Column({name: 'valor_pago'})
    @Type(() => Number)
    valorPago: number;

    @Expose({name: 'forma_de_pagamento'})
    @Column({name: 'forma_de_pagamento'})
    formaPagamento: string;

    @Expose({name: 'valor_total'})
    @Column({name: 'valor_total'})
    @Type(() => Number)
    valorTotal: number;

    @Column()
    @Type(() => Number)
    descontos: number;

    @Column()
    @Type(() => Number)
    troco: number;

    @Column()
    @Type(() => Number)
    tributos: number;

    @Column()
    data: Date;

    @Expose({name: 'id_categoria'})
    @Column({name: 'id_categoria'})
    @Type(() => Number)
    idCategoria: number;

    @Column()
    @Type(() => Number)
    latitude: number;

    @Column()
    @Type(() => Number)
    longitude: number;

    @Column()
    excluido: boolean;

    @JoinColumn({ name: "id_categoria" })
    @ManyToOne(() => Categoria)
    categoria: Categoria;

    @OneToMany(() => Produto, produto => produto.nfe)
    produtos: Produto[];

    @Expose({name: 'valor_pago_real'})
    public get valorPagoReal(): string {
        return mascaraReais(this.valorPago);
    }

    @Expose({name: 'descontos_real'})
    public get descontosReal() {
        return mascaraReais(this.descontos);
    }

    @Expose({name: 'valor_total_real'})
    public get valorTotalReal() {
        return mascaraReais(this.valorTotal);
    }

    @Expose({name: 'troco_real'})
    public get trocoReal() {
        return mascaraReais(this.troco);
    }

    @Expose({name: 'tributos_real'})
    public get tributosReal() {
        return mascaraReais(this.tributos);
    }

    @Expose({name: 'date_short'})
    public get dateShort(): string {
        return moment(this.data).locale('pt-br').format('ll');
    }

    @Expose({name: 'data_br'})
    public get dataBr(): string {
        return moment(this.data).format('DD/MM/YYYY HH:mm:ss');
    }
}