import type { YahooTransaction, YahooTransactionPlayer } from "../../types/yahoo";

export function mapTransactions(data: YahooTransaction | YahooTransaction[]): YahooTransaction[] {
    const transactions = NormalizeToArray<YahooTransaction>(data);

    for (let i = 0; i < transactions.length; i++) {
        transactions[0].players.player = NormalizeToArray<YahooTransactionPlayer>(transactions[0].players.player);
    }

    return transactions;
}

export function NormalizeToArray<T>(entry: T | T[]): T[] {
    if (!Array.isArray(entry)) {
        return [entry] as T[];
    }
    return entry as T[];
}
