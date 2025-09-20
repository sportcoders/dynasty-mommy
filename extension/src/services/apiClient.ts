const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const serverPost = async <T, U>(
    endpoint: string,
    data: U
): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json() as Promise<T>;
};

