import { Expose, Type } from "class-transformer";
import { Nfe } from "src/nfe/nfe.entity";
import { mascaraReais } from "src/util/formatadorMoeda";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

/**
 * Representa a entidade de produto
 */
@Entity()
export class Produto {

    constructor(args?: Produto) {
        this.id = args?.id;
        this.nome = args?.nome;
        this.quantidade = args?.quantidade;
        this.unidade = args?.unidade;
        this.valorUnitario = args?.valorUnitario;
        this.valorTotalItem = args?.valorTotalItem;
        this.idNotalFiscal = args?.idNotalFiscal;
        this.nfe = args?.nfe;
    }

    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @Column()
    nome: string;

    @Column()
    @Type(() => Number)
    quantidade: number;

    @Column()
    unidade: string;

    @Column({name: 'valor_unitario'})
    @Type(() => Number)
    valorUnitario: number;

    @Column({name: 'valor_total_item'})
    @Type(() => Number)
    valorTotalItem: number;

    @Column({name: 'id_nota_fiscal'})
    @Type(() => Number)
    idNotalFiscal: number;

    @JoinColumn({ name: "id_nota_fiscal" })
    @ManyToOne(() => Nfe, nfe => nfe.produtos)
    nfe: Nfe;

    @Expose({name: 'valor_unitario_real'})
    public get valorUnitarioReal() {
        return mascaraReais(this.valorUnitario);
    }

    @Expose({name: 'valor_total_item_real'})
    public get valorTotalItemReal() {
        return mascaraReais(this.valorTotalItem);
    }
}