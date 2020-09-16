import { Expose, Type } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @Column()
    descricao: string;

    @Expose()
    get img(): string {
        return `http://144.202.21.184:8085/categoria/${this.id}/img`;
    }
}