import { Body, Controller, Get, Post} from "@nestjs/common";
import { Nfe } from "src/nfe/nfe.entity";
import { NfeService } from "src/nfe/nfe.service";
import { ContextHolder } from "src/security/contextHolder";
import { generateJWT } from "src/security/jwtConfig";
import { GoogleApiService } from "src/service/googleApi.service";
import { Nodemailer } from "src/service/nodemailer";
import * as xlsx from "xlsx";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";
import { LoginDto } from "./validator/loginDto";

/**
 * Classe responsável por controlar as requisições referentes aos usuários
 */
@Controller("usuario")
export class UsuarioController {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly nfeService: NfeService,
        private readonly googleApiService: GoogleApiService,
        private readonly contextHolder: ContextHolder,
        private readonly nodemailer: Nodemailer
    ) { }

    /**
     * Retorna todas as NFE do usuário
     */
    @Get("nfe")
    findAllByUserId(): Promise<Nfe[]> {
        return this.nfeService.findAllByUserId(this.contextHolder.tokenId);
    }

    /**
     * Realiza o login com o token de verificação do Google
     * @param loginDto
     */
    @Post("login")
    async login(@Body() loginDto: LoginDto): Promise<Usuario> {
        console.log('app', process.env.APP_NAME)
        const googleUser = await this.googleApiService.valiteGoogleLoginToken(loginDto.token);

        let usuario = new Usuario(googleUser.data.name, googleUser.data.email);
        usuario = await this.usuarioService.mergeByEmail(usuario);
        usuario.img = googleUser.data.picture;
        usuario.token = generateJWT(usuario.id);

        return usuario;
    }

    /**
     * Exporta os dados da NFE
     */
    @Get("export")
    async export(): Promise<any> {
        const wb = xlsx.utils.book_new();
        wb.Props = {
            Title: "Relatório finanças qr",
            Subject: "Relatório de notas fiscais",
            Author: "",
            CreatedDate: new Date()
        };
        wb.SheetNames.push("relatorio");

        const notas = await this.nfeService.findAllByUserId(this.contextHolder.tokenId);
        const wsData = [
            ["Resumo de Notas por Credor - Referente ao período", "Data inicial", "Data final"],
            ["", notas[notas.length - 1].data, notas[0].data],
            ["CNPJ", "Nome Credor (Razão Social)", "Quantidade item", "Data Pagamento", "Valor total", "Desconto", "Tributos", "Valor líquido", "N° Nota Fiscal"]
        ];
        for (const nota of notas) {
            wsData.push([
                nota.cnpj,
                nota.razaoSocial,
                `${nota.totalItens}`,
                nota.data,
                `${nota.valorTotal}`,
                `${nota.descontos ? nota.descontos : 0}`,
                `${nota.tributos ? nota.tributos : 0}`,
                `${nota.valorTotal - (nota.descontos ? nota.descontos : 0)}`,
                nota.url,
            ]);
        }
        
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        wb.Sheets["relatorio"] = ws;

        const user = await this.usuarioService.findById(this.contextHolder.tokenId);
        return await this.nodemailer.enviarEmailExportacaoXlsx(
            user.email,
            { filename: "export.xlsx", content: xlsx.write(wb, { bookType: "xlsx", type: "buffer" }) },
        );
    }
}