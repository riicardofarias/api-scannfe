import * as JWT from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const ALGORITHM = "HS512";

export function generateJWT(id: number): string {
    return JWT.sign({
        //exp: TIMEOUT,
        data: id,
        algorithm: ALGORITHM
    }, SECRET);
}

export function validateJWT(jwt: string): string | object {
    return JWT.verify(jwt, SECRET);
}