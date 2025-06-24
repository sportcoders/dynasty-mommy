import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import config from '../config/config'
const defaults = {
    audience: 'user',
}

const accessTokenDefaults: SignOptions = {
    ...defaults,
    expiresIn: '2 days'
}
// const refreshTokenDefaults = {
//     ...defaults,
//     expiresIn: '30d'
// }
export interface Token {
    id: string
}
export const createToken = (payload: Token, options = accessTokenDefaults) => {
    return jwt.sign(payload,
        config.JWT_SECRET,
        options
    )
}

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(
            token,
            config.JWT_SECRET,
            { ...defaults }
        );
        if (typeof decoded === 'string') {
            return { error: "Invalid token format" }
        }
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return { error: "Token missing required properties" }
        }
        const payload = decoded as Token & JwtPayload;

        return {
            payload: {
                id: payload.id
            }
        };
    }
    catch (error) {
        return {
            error
        }
    }
}
