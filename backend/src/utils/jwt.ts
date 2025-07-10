import jwt, { SignOptions } from 'jsonwebtoken'
import config from '../config/config'
const defaults = {
    audience: 'user',
}

export const accessTokenDefaults: SignOptions = {
    ...defaults,
    expiresIn: '2 days'
}
export const refreshTokenDefaults: SignOptions = {
    ...defaults,
    expiresIn: '30d'
}
interface BaseToken {
    type: 'access' | 'refresh'
}
export interface RefreshToken extends BaseToken {
    type: 'refresh',
    session_id: string
}
export interface AccessToken extends BaseToken {
    type: 'access',
    id: string,
    email: string
}
type TokenPayload = AccessToken | RefreshToken
export const createToken = (payload: BaseToken, options = accessTokenDefaults) => {
    return jwt.sign(payload,
        config.JWT_SECRET,
        options
    )
}

export const verifyToken = (token: string): { payload?: TokenPayload, error?: undefined } => {
    try {
        const payload = jwt.verify(
            token,
            config.JWT_SECRET,
            { ...defaults }
        ) as TokenPayload;

        return { payload };
    }
    catch (error: any) {
        return {
            error
        }
    }
}
