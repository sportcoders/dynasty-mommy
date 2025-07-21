export class SleeperError extends Error {
    public statusCode: number;
    public statusText: string;

    constructor(
        statusCode: number,
        statusText: string,
    ) {
        super(`Sleeper request failed: ${statusCode} ${statusText}`);
        this.name = 'SleeperError';
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}

export class ServerError extends Error {
    public statusCode: number;
    public statusText: string;

    constructor(
        statusCode: number,
        statusText: string,
    ) {
        super(`Server request failed: ${statusCode} ${statusText}`);
        this.name = 'ServerError';
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}