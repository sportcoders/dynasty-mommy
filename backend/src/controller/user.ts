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
        return res.status(HttpError.UNAUTHORIZED).send({ message: "Missing Email or Password" })
    }

    try {
        //authenticate user
        const user = await User.findOne({ email: email })

        if (!user || !user.password) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "User Not Found" });
        }

        if (!compareSync(password, user!.password)) {
            return res.status(HttpError.UNAUTHORIZED).send({ message: "invalid credentials" })
        }
        else {
            const payload: Token = {
                id: email
            }
            const token = createToken(payload)
            return res.status(HttpSuccess.OK).header({ "Authentication": `Bearer ` + token }).end()
        }
    }
    catch (error) {
        next(error)
    }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(HttpError.UNAUTHORIZED).send({ message: "Missing Email or Password" })
    }
    //check if user already exists in db
    try {
        const check = await User.find({ email: email })
        console.log(check)
        if (check.length > 0) {
            throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "User Already Exists" })
        }
        const hashed_pw = await hash(password, config.salt_rounds)
        console.log(hashed_pw)
        const user = new User({ email: email, password: hashed_pw })
        const savedUser = await user.save()
        console.log(savedUser)
        return res.status(HttpSuccess.OK).send({ detail: "user created successfully" })

    }
    //hash pwd
    catch (err) {
        next(err)
    }
}

export async function addLeagueToUser(req: Request, res: Response, next: NextFunction) {
    try {
        const league = req.body.league;

        if (!req.user || !req.user.email) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        if (!league) {
            return res.status(HttpError.BAD_REQUEST).json({ message: "League is required" });
        }

        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            throw new AppError({
                statusCode: HttpError.NOT_FOUND,
                message: "User not found",
            });
        }

        user.leagues.push(league);
        await user.save();

        return res.status(HttpSuccess.OK).json({
            message: "League added successfully",
            leagues: user.leagues,
        });
        // const update = await User.findOneAndUpdate({ email: req.user?.email }, { $push: { leagues: req.body.leagues } })
    }
    catch (err) {
        next(err)
    }
}