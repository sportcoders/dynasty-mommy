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
    id?: string,
    email: string,
    username?: string
}
export const createToken = (payload: Token, options = accessTokenDefaults) => {
    return jwt.sign(payload,
        config.JWT_SECRET,
        options
    )
}

export const verifyToken = (token: string): { payload?: Token, error?: undefined } => {
    try {
        const payload = jwt.verify(
            token,
            config.JWT_SECRET,
            { ...defaults }
        ) as Token;

        return { payload };
    }
    catch (error: any) {
        return {
            error
        }
    }
}
