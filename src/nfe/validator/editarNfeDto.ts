import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class EditarNfeDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    id_categoria: number;
}