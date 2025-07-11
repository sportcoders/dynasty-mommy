import { useState, useEffect } from "react";

// Overloads
export default function useDelayedLoading(
    loadings: boolean,
    delayMs?: number
): boolean;
export default function useDelayedLoading(
    loadings: boolean[],
    delayMs?: number
): boolean[];

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
    }, [loadingArray.join(","), delayMs]);

    return Array.isArray(loadings) ? showLoadingArray : showLoadingArray[0];
}
