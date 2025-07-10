import { useState, useEffect } from "react";

/**
 * Returns delayed loading states for one or more loading booleans.
 * Shows `true` only if loading has persisted longer than delayMs.
 *
 * @param loadings - A boolean or array of booleans representing loading states.
 * @param delayMs - Delay in milliseconds before showing loading (default 200ms).
 * @returns If input is single boolean, returns one boolean; if array, returns array.
 */
export default function useDelayedLoading(
    loadings: boolean | boolean[],
    delayMs = 200
): boolean | boolean[] {
    const loadingArray = Array.isArray(loadings) ? loadings : [loadings];
    const [showLoadingArray, setShowLoadingArray] = useState(
        loadingArray.map(() => false)
    );

    useEffect(() => {
        const timeouts: ReturnType<typeof setTimeout>[] = [];

        loadingArray.forEach((loading, index) => {
            if (loading && !showLoadingArray[index]) {
                const timeout = setTimeout(() => {
                    setShowLoadingArray((prev) => {
                        const copy = [...prev];
                        copy[index] = true;
                        return copy;
                    });
                }, delayMs);
                timeouts.push(timeout);
            } else if (!loading && showLoadingArray[index]) {
                setShowLoadingArray((prev) => {
                    const copy = [...prev];
                    copy[index] = false;
                    return copy;
                });
            }
        });

        return () => {
            timeouts.forEach((t) => clearTimeout(t));
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingArray.join(","), delayMs, showLoadingArray]);

    return Array.isArray(loadings) ? showLoadingArray : showLoadingArray[0];
}
