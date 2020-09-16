import { HttpService, Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import * as moment from "moment";
import { Nfe } from "src/nfe/nfe.entity";
import { Produto } from "src/produto/produto.entity";
import { axiosErrorHandler, axiosValidateHttpStatus } from "src/util/axiosHandler";
import { GoogleApiService } from "./googleApi.service";

/**
 * Classe responsável por realizar a extração dos dados da NFE do Acre
 */
@Injectable()
export class NfeAcreService {
    constructor(
        private httpService: HttpService,
        private googleApiService: GoogleApiService
    ) { }

    /**
     * Extrai os dados da NFE
     * @param url Url da NFE
     */
    public async crawler(url: string): Promise<Nfe> {
        const redirecResponse = await this.httpService
            .get(url, { maxRedirects: 0, validateStatus: axiosValidateHttpStatus })
        .toPromise().catch(axiosErrorHandler);
        
        const cookies = redirecResponse.headers['set-cookie'].toString();
        const redirectUrl = redirecResponse.headers['location'];

        const finalResponse = await this.httpService
            .get(redirectUrl, { validateStatus: axiosValidateHttpStatus, headers: { Cookie: cookies } })
        .toPromise().catch(axiosErrorHandler);

        const nfe = this.htmlScraping(finalResponse.data);
        
        const coords = await this.googleApiService.coordinatesByEstablishmentName(nfe.endereco).catch(() => null);
        if (coords != null) {
            nfe.latitude = coords.lat;
            nfe.longitude = coords.lng;
        }

        nfe.url = url;
        return nfe;
    }

    /**
     * Realiza o web scrapping da NFE
     * @param html HTML
     */
    private htmlScraping(html: string): Nfe {
        const $ = cheerio.load(html);

        const notaFiscal = new Nfe();
        notaFiscal.razaoSocial = this.clean($("#u20").text().trim());
        notaFiscal.cnpj = this.clean($("#u20 + div").text().trim());
        notaFiscal.endereco = this.clean($("#u20 + div + div").text().trim());

        const divTotalNota = cheerio.load($("#totalNota").html());
        divTotalNota("div").each((index) => {
            const label = divTotalNota("div label").eq(index).text().trim().toLowerCase();
            switch (label) {
                case "qtd. total de itens:":
                    notaFiscal.totalItens = this.toInt(divTotalNota("div span").eq(index).text());
                    break;

                case "valor total r$:":
                    notaFiscal.valorTotal = this.toCents(divTotalNota("div span").eq(index).text());
                    break;

                case "descontos r$:":
                    notaFiscal.descontos = this.toCents(divTotalNota("div span").eq(index).text());
                    break;

                case "valor a pagar r$:":
                    notaFiscal.valorPago = this.toCents(divTotalNota("div span").eq(index).text());
                    break;

                case "forma de pagamento:":
                    notaFiscal.formaPagamento = this.clean(divTotalNota("div label").eq(index + 1).text().trim().toLowerCase());
                    if (notaFiscal.valorTotal == null) {
                        notaFiscal.valorTotal = this.toCents(divTotalNota("div span").eq(index + 1).text());
                    }
                    notaFiscal.troco = this.toCents(divTotalNota("div span").eq(index + 2).text());
                    notaFiscal.tributos = this.toCents(divTotalNota("div span").eq(index + 3).text());
                    break;

                default:
                    break;
            }
        })

        const matchData = $("#infos > div > ul > li").text().match(/[\d]{2}\/[\d]{2}\/[\d]{4} [\d]{2}:[\d]{2}:[\d]{2}/);
        const stringData = matchData ? moment(matchData[0], "DD/MM/YYYY HH:mm:ss").parseZone().toString() : null;
        notaFiscal.data = new Date(stringData as string);

        notaFiscal.produtos = []
        
        $("#tabResult tbody").find('tr').each((index, el) => {
            const produto = new Produto();
            produto.nome = this.clean($(el).find('td').eq(0).find('span').eq(0).text().trim());
            produto.quantidade = this.toDecimal($(el).find('td').eq(0).find('span').eq(2).text());
            produto.unidade = this.clean($(el).find('td').eq(0).find('span').eq(3).text().trim());
            produto.valorUnitario = this.toCents($(el).find('td').eq(0).find('span').eq(4).text());
            produto.valorTotalItem = this.toCents($(el).find('td').eq(1).find('span').eq(0).text());
            notaFiscal.produtos ? notaFiscal.produtos.push(produto) : null;
        })
        
        return notaFiscal;
    }

    private clean(value: string): string {
        return value.replace(/([\s+\n]+)/g, " ").replace(/, ,/g, ',');
    }

    private toCents(value: string): number {
        const replace = value.replace(/[^0-9,]+/g, "").replace(',', '.');
        const result = Number.parseFloat(replace);
        return !isNaN(result) ? Math.round(result * 100) : 0;
    }

    private toInt(value: string): number {
        const replace = value.replace(/[^0-9]+/g, "");
        const result = Number.parseInt(replace);
        return !isNaN(result) ? result : 0;
    }

    private toDecimal(value: string): number {
        const replace = value.replace(/[^0-9,]+/g, "").replace(',', '.');
        const result = Number.parseFloat(replace);
        return !isNaN(result) ? result : 0;
    }
}