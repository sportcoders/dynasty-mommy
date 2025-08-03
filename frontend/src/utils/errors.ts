export class AppError extends Error {
    public statusCode: number;
    public statusText: string;

    constructor(
        messagePrefix: string = "Error",
        statusCode: number,
        statusText: string,
    ) {
        super(`${messagePrefix}: ${statusCode} ${statusText}`);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}
export class SleeperError extends AppError {

    constructor(
        statusCode: number,
        statusText: string,
    ) {
        super(`Sleeper request failed`, statusCode, statusText);
        this.name = 'SleeperError';
    }
}

export class ServerError extends AppError {

    constructor(
        statusCode: number,
        statusText: string,
    ) {
        super(`Server request failed`, statusCode, statusText);
        this.name = 'ServerError';
    }
}