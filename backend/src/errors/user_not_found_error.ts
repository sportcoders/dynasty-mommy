import { HttpError } from "../constants/constants";
import { AppError } from "./app_error";

export const user_not_found_error = new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });