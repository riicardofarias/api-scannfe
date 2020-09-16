import { IsNotEmpty, Matches } from "class-validator";

export class BuscaNfeDto {
    @IsNotEmpty()
    @Matches(/www\.sefaznet\.ac\.gov\.br/)
    url: string;
}