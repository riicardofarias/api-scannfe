import { Request } from 'express';

/**
 * Rotas liberadas por padrão
 */
const OPEN_ROUTES: Rota[] = [
    { path: "/categoria/:id/img", method: "GET" },
    { path: "/usuario/login", method: "POST" }
];

/**
 * Verifica se a rota está liberada
 * @param request Request
 */
export function isOpenRoute(request: Request): boolean {
    return OPEN_ROUTES.find(it => it.path == request.route.path && it.method == request.method) ? true : false;
}

interface Rota {
    path: string;
    method: string;
}