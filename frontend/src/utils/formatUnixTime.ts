/**
 * Converts a Unix timestamp into a human-readable date string.
 *
 * @param time - The Unix timestamp to format. Can be a string or number representing
 *               milliseconds since the Unix epoch (January 1, 1970, UTC).
 *
 * @returns A formatted date string in the format:
 *          `MMM DD YYYY HH:MM`
 *          (e.g., `"Jan 01 2025 13:45"`).
 *
 * @example
 * ```ts
 * formatUnixTime("1737078300000"); // "Jan 17 2025 13:45"
 * ```
 */
export const formatUnixTime = (time: string | number): string => {
    const day = new Date(Number(time));
    return day.toString().substring(4, 21);
};
