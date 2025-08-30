export class AppError extends Error {
    public statusCode: number;
    public statusText: string;

    constructor(
        messagePrefix: string = "Error",
        statusCode: number,
        statusText: string,
        message?: string
    ) {
        super(message || `${messagePrefix}: ${statusCode} ${statusText}`);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}
export class SleeperError extends AppError {

    constructor(
        statusCode: number,
        statusText: string,
        message?: string
    ) {
        super(message || `Sleeper request failed`, statusCode, statusText);
        this.name = 'SleeperError';
    }
}

export class ServerError extends AppError {

    constructor(
        statusCode: number,
        statusText: string,
        message?: string
    ) {
        super(message || `Server request failed`, statusCode, statusText);
        this.name = 'ServerError';
    }
}