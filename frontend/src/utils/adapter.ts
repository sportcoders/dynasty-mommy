export function NormalizeToArray<T>(entry: T | T[]): T[] {
    if (!Array.isArray(entry)) {
        return [entry] as T[];
    }
    return entry as T[];
}
