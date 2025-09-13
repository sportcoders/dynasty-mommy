import { AppDataSource } from "../app";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { User } from "../models/user";

/**
 * function to check that the user_id from the jwt is valid
 * @param user_id dynasty_mommy user_id
 * @returns user_id if user is a valid user
 */
export async function checkUserId(user_id?: string) {
    if (!user_id) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "missing token" });

    const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: user_id });

    if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

    return user_id;
}