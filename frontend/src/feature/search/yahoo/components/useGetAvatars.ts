import { useQueries } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export function useGetAvatars(urls: string[]) {
    const objectUrlsRef = useRef<Set<string>>(new Set());
    const uniqueUrls = [...new Set(urls)];

    const results = useQueries({
        queries: uniqueUrls.map((url) => ({
            queryKey: ['imageBlob', url],
            queryFn: async () => {
                const response = await fetch(`${url}`);
                if (!response.ok) throw new Error('Failed to fetch image');
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                objectUrlsRef.current.add(objectUrl);
                return objectUrl;
            },
            enabled: !!url,
        })),
    });

    const urlToData = uniqueUrls.reduce((acc, url, index) => {
        acc[url] = results[index].data;
        return acc;
    }, {} as Record<string, any>);

    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            objectUrlsRef.current = new Set();
        };
    }, []);

    //checks that all data has been fetched successfully(no undefined values)
    const allDataAvailable = uniqueUrls.every((url) => !!urlToData[url]);


    const isLoading = results.some((r) => r.isLoading) || !allDataAvailable;
    return {
        objectUrls: urlToData,
        isLoading: isLoading,
        isError: results.some((r) => r.isError),
        errors: results.map((r) => r.error),
    };
}
