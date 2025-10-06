import type { YahooTransaction, YahooTransactionPlayer } from "../../types/yahoo";

export function mapTransactions(data: YahooTransaction | YahooTransaction[]): YahooTransaction[] {
    const transactions = NormalizeToArray<YahooTransaction>(data);
    for (let i = 0; i < transactions.length;) {
        if (!transactions[i].players || !transactions[i].players.player) {
            transactions.splice(i, 1);
        }
        else {
            transactions[i].players.player = transactions[i].players.player ? NormalizeToArray<YahooTransactionPlayer>(transactions[i].players.player) : [];
            i++;
        }
    }

    return transactions;
}

export function NormalizeToArray<T>(entry: T | T[]): T[] {
    if (!Array.isArray(entry)) {
        return [entry] as T[];
    }
    return entry as T[];
}
