import { Type } from "class-transformer";
import { Nfe } from "src/nfe/nfe.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

/**
 * Representa a entidade de NFE do usuário
 */
@Entity({ name: "usuario_nota_fiscal" })
export class UsuarioNfe {

    constructor(args?: UsuarioNfe) {
        this.id = args?.id;
        this.idNotaFiscal = args?.idNotaFiscal;
        this.idUsuario = args?.idUsuario;
        this.nfe = args?.nfe;
        this.usuario = args?.usuario;
    }

    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @Column({name: 'id_nota_fiscal'})
    @Type(() => Number)
    idNotaFiscal: number;

    @Column({ name: 'id_usuario' })
    @Type(() => Number)
    idUsuario: number;

    @JoinColumn({ name: "id_nota_fiscal" })
    @ManyToOne(() => Nfe)
    nfe: Nfe;

    @JoinColumn({ name: "id_usuario" })
    @ManyToOne(() => Usuario)
    usuario: Usuario;
}