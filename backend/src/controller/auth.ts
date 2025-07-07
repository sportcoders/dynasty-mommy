import { NextFunction, Request, Response } from "express"
import { User } from "../models/user"
import { compareSync, hash } from "bcrypt"
import { createToken, Token, verifyToken } from "../utils/jwt"
import { HttpSuccess, HttpError } from "../constants/constants"
import { AppError } from "../errors/app_error"
import config from "../config/config"
import { AppDataSource } from "../app"
import { userLogin, userSignUp } from "../schemas/user"

const setAuthCookies = (res: Response, accessToken: string) => {
    res.cookie("accessToken", accessToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: false //CHANGE TO TRUE WHEN NOT IN DEVELOPMENT
    })
}
export async function login(req: Request, res: Response, next: NextFunction) {


    try {
        const { email, password } = await userLogin.parseAsync(req.body)

        //authenticate user
        const user = await AppDataSource.getRepository(User).findOne({ where: { email } })

        if (!user || !user.password) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "User Not Found" });
        }

        if (!compareSync(password, user!.password)) {
            return res.status(HttpError.UNAUTHORIZED).send({ message: "invalid credentials" })
        }
        else {
            const payload: Token = {
                id: user.id,
                email: email
            }
            const token = createToken(payload)

            setAuthCookies(res, token)
            return res.status(HttpSuccess.OK).send({
                username: user.username
            })
        }
    }
    catch (error) {
        next(error)
    }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, username } = await userSignUp.parseAsync(req.body)


        //check if user already exists in db
        const [existingEmail, existingUsername] = await Promise.all([AppDataSource.manager.findOneBy(User, { email: email }), AppDataSource.manager.findOneBy(User, { username: username })])
        if (existingEmail) {
            throw new AppError({ statusCode: HttpError.CONFLICT, message: "Email Already Exists" })
        }
        if (existingUsername) {
            throw new AppError({ statusCode: HttpError.CONFLICT, message: "Username is already taken" })
        }
        const hashed_pw = await hash(password, config.salt_rounds)
        const user = AppDataSource.manager.create(User, { email: email, password: hashed_pw, username: username })
        const result = await AppDataSource.manager.save(User, user)

        const payload: Token = {
            id: result.id,
            email: email
        }
        const token = createToken(payload)

        setAuthCookies(res, token)
        return res.status(HttpSuccess.CREATED).send({ detail: "user created successfully", username: user.username })

    }
    catch (err) {
        next(err)
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken

        const { payload, error } = verifyToken(refreshToken)

        if (error || !payload) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Session Expired" });

        const newAccessToken = createToken({ id: payload.id, email: payload.email, username: payload.username })
        setAuthCookies(res, newAccessToken)
        return res.status(HttpSuccess.OK).json({ detail: "accessToken refreshed" })

    }
    catch (e) {
        next(e)
    }
}