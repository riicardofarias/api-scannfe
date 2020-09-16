import { HttpService, Injectable } from "@nestjs/common";
import { AxiosResponse } from 'axios';
import { axiosErrorHandler, axiosValidateHttpStatus } from "src/util/axiosHandler";

const googleApiKey = process.env.GOOGLE_API_KEY;

@Injectable()
export class GoogleApiService {
    constructor(private httpService: HttpService) {}

    /**
     * Valida o token de autorização do Google
     * @param token Token
     */
    valiteGoogleLoginToken(token: string): Promise<AxiosResponse> {
        const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;

        return this.httpService.get(url, { 
            validateStatus: axiosValidateHttpStatus
        }).toPromise().catch(axiosErrorHandler);
    }

    /**
     * Retorna as coordenadas do estabelecimento
     * @param nome Nome do estabelecimento
     */
    async coordinatesByEstablishmentName(nome: string): Promise<any> {
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${nome}&inputtype=textquery&fields=formatted_address,name,geometry&key=${googleApiKey}`;

        const result = await this.httpService.get(url, { 
            validateStatus: axiosValidateHttpStatus
        }).toPromise().catch(axiosErrorHandler);
        
        if (result.data.status === "ZERO_RESULTS") {
            return Promise.reject("ZERO_RESULTS");
        }
        
        if (!result.data.candidates || !result.data.candidates.length || !result.data.candidates[0].geometry) {
            return Promise.reject(result.data);
        }
        
        return result.data.candidates[0].geometry.location;
    }
}