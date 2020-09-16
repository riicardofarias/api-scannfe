import { HttpException, HttpStatus } from "@nestjs/common";
import { AxiosError } from 'axios';

/**
 * Controlador de erros
 * @param error AxiosError
 */
export function axiosErrorHandler(error: AxiosError): Promise<any> {
    if (!error.response) {
        return Promise.reject(
            new HttpException("Não foi possível obter uma resposta com a url informada!", HttpStatus.BAD_REQUEST)
        );
    }
    return Promise.reject(
        new HttpException(JSON.stringify(error.response.data), error.response.status)
    );
}

export function axiosValidateHttpStatus(stauts: number): boolean {
    return stauts < 400;
}