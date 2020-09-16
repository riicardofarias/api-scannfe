import { Type } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Representa a entidade de usuário
 */
@Entity()
export class Usuario {

    constructor(nome?: string, email?: string) {
        this.nome = nome;
        this.email = email;
    }

    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    img: string;

    token: string;
}