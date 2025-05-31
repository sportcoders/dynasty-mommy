import { NextFunction, Request, Response } from "express"
import User from "../models/user"
import { compareSync, hash } from "bcrypt"
import { createToken, Token } from "../utils/jwt"
import { HttpSuccess, HttpError } from "../constants/constants"
import { AppError } from "../errors/app_error"
import config from "../config/config"

export async function login(req: Request, res: Response, next: NextFunction) {
    const password: string = req.body.password
    const email: string = req.body.email

    if (!email || !password) {
        res.status(HttpError.UNAUTHORIZED).send({ message: "Missing Email or Password" })
    }

    try {
        //authenticate user
        const user = await User.findOne({ email: email })
        if (!user || !user.password) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "User Not Found" });
        }

        if (!compareSync(password, user.password)) {
            return res.status(HttpError.UNAUTHORIZED)
        }
        else {
            const payload: Token = {
                id: email
            }
            const token = createToken(payload)

            return res.status(HttpSuccess.OK).header({ "Authentication": `Bearer ` + token })
        }
    }
    catch (error) {
        next(error)
    }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email
    const password = req.body.password

    //check if user already exists in db
    try {
        const check = await User.find({ email: email })
        if (check) {
            throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "User Already Exists" })
        }
        const hashed_pw = await hash(password, config.salt_rounds)
        const user = await User.create({ email: email, passwod: hashed_pw })

    }
    //hash pwd
    catch (err) {
        next(err)
    }
}