import { CookieOptions, NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { compareSync, hash } from "bcrypt";
import { AccessToken, createToken, RefreshToken, verifyToken } from "../utils/jwt";
import { HttpSuccess, HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import config from "../config/config";
import { AppDataSource } from "../app";
import { userLogin, userSignUp } from "../schemas/user";
import UserSession from "../models/session";

const refreshPath = '/auth/refresh';
//DEFAULT COOKIE OPTIONS
const cookieDefaults: CookieOptions = {
    sameSite: config.nodeEnv == 'development' ? "none" : 'lax',
    httpOnly: true,
    secure: config.nodeEnv == 'development', //CHANGE TO TRUE WHEN NOT IN DEVELOPMENT
};
const accessOptions: CookieOptions = {
    ...cookieDefaults,
    maxAge: 2 * 24 * 60 * 60 * 1000 //2 days
};
const refreshOptions: CookieOptions = {
    ...cookieDefaults,
    path: refreshPath,
    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
};
/**
 * Functions used to set cookies
 * @param res - express response object
 * @param token - the jwt token to set
 */
const setAuthCookies = (res: Response, accessToken: string) => {
    res.cookie("accessToken", accessToken, accessOptions);
};
const setRefreshToken = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, refreshOptions);
};
const clearAccessCookies = (res: Response) => {
    res.clearCookie("accessToken", accessOptions);
};
const clearRefreshCookies = (res: Response) => {
    res.clearCookie("refreshToken", refreshOptions);
};
/**
 * Function used to create a refresh token and add the session into the database
 * @param id user_id from sportscoder backend
 * @param email email linked to user_id from sports coder backend
 * @returns a refresh token
 */
async function createRefreshToken(id: string, email: string) {
    const session = await UserSession.create({ userId: id, userEmail: email });
    const refreshPayload: RefreshToken = {
        type: "refresh",
        session_id: session._id.toString()
    };
    const token = createToken(refreshPayload);
    return token;
}
/**
 * 
 * REQUEST BODY PARAMS
 * @param email - users email, sports coder backend
 * @param password - users password 
 * @returns response code of 200 if login was successful, 404 login was not
 */
export async function login(req: Request, res: Response, next: NextFunction) {


    try {
        const { email, password } = await userLogin.parseAsync(req.body);

        //authenticate user
        const user = await AppDataSource.getRepository(User).findOne({ where: { email: email.toLowerCase() } });

        if (!user || !user.password) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "User Not Found" });
        }

        if (!compareSync(password, user!.password)) {
            throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "invalid crendentials" });
        }
        else {
            const auth_payload: AccessToken = {
                type: 'access',
                id: user.id,
                email: email
            };
            const token = createToken(auth_payload);

            setAuthCookies(res, token);
            const refreshToken = await createRefreshToken(user.id, user.email);
            setRefreshToken(res, refreshToken);
            res.status(HttpSuccess.OK).send({
                username: user.username
            });
        }
    }
    catch (error) {
        next(error);
    }
}
/**
 * REQUEST BODY PARAMS
 * @param email - the email they want to create an account with
 * @param password - the password the user has chosen
 * @param username - the username the user has chosen
 * @returns 
 *          - 201(SUCCESS)  - if account was created successfully
 *          - 409(CONFLICT) - if the username the user selected is already taken
 *                          - if the email already belongs to an account
 */
export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email: emailInput, password, username } = await userSignUp.parseAsync(req.body);
        const email = emailInput.toLowerCase();

        //check if user already exists in db
        const [existingEmail, existingUsername] = await Promise.all([AppDataSource.manager.findOneBy(User, { email: email }),
        // AppDataSource.getRepository(User).createQueryBuilder("user").where("user.username ILIKE :username", { username: username }).getOne()
        AppDataSource.getRepository(User).createQueryBuilder("user").where("user.username LIKE LOWER(:username)", { username }).getOne()

        ]);

        if (existingEmail) {
            throw new AppError({ statusCode: HttpError.CONFLICT, message: "Email Already Exists" });
        }
        if (existingUsername) {
            throw new AppError({ statusCode: HttpError.CONFLICT, message: "Username is already taken" });
        }
        const hashed_pw = await hash(password, config.salt_rounds);
        const user = AppDataSource.manager.create(User, { email: email, password: hashed_pw, username: username });
        const result = await AppDataSource.manager.save(User, user);

        const auth_payload: AccessToken = {
            type: 'access',
            id: user.id,
            email: email
        };
        const token = createToken(auth_payload);
        const refreshToken = await createRefreshToken(user.id, user.email);
        //setting tokens
        setRefreshToken(res, refreshToken);
        setAuthCookies(res, token);
        res.status(HttpSuccess.CREATED).send({ detail: "user created successfully", username: user.username });

    }
    catch (err) {
        next(err);
    }
}
/**
 * REFRESH ENDPOINT FOR WHEN ACCESS TOKENS ARE EXPIRED
 * @returns 
 *          - 200(SUCCESS) - if token was refreshed successfully
 *          - 401(UNAUTHORIZED) - if token could not be refreshed
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;

        const { payload, error } = verifyToken(refreshToken);

        if (error || !payload) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Session Expired" });

        if (payload.type == 'access') throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "access token set as refresh" });

        //check session in db
        const session = await UserSession.findById(payload.session_id);
        if (!session || session.expiresAt < new Date()) {
            throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Expired/missing session" });
        }
        //create auth token
        const auth_payload: AccessToken = {
            type: 'access',
            id: session.userId!,
            email: session.userEmail!
        };
        const newAccessToken = createToken(auth_payload);
        setAuthCookies(res, newAccessToken);
        res.status(HttpSuccess.OK).json({ detail: "accessToken refreshed" });

    }
    catch (e) {
        clearAccessCookies(res);
        clearRefreshCookies(res);
        next(e);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    clearAccessCookies(res);
    clearRefreshCookies(res);
    res.status(HttpSuccess.OK).send();
}