import { Injectable, Scope } from '@nestjs/common';

/**
 * Contém o código do usuário
 */
@Injectable({ scope: Scope.REQUEST })
export class ContextHolder {
    tokenId: number;
}