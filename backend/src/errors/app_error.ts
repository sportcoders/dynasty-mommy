import { HttpErrorCode } from "../constants/constants";

export class AppError extends (Error) {
    statusCode: HttpErrorCode
    // errorCode: any
    cause: any
    constructor({ statusCode,
        message,
        //  errorCode,
        cause }: {
            statusCode: HttpErrorCode,
            message: string,
            //  errorCode?: number,
            cause?: any
        }) {
        super(message);
        this.statusCode = statusCode;
        // if (errorCode)
        // this.errorCode = errorCode;
        if (cause)
            this.cause = cause
    }
}