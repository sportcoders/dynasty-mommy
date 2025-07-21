import { useAppDispatch } from "@app/hooks";
import { logout } from "@feature/auth/authSlice";
import { SleeperError, ServerError } from "@utils/errors";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL;
const BASE_URL = import.meta.env.VITE_SLEEPER_URL;
const AVATAR_URL = import.meta.env.VITE_SLEEPER_AVATAR_URL;

export const sleeper_apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}?ts=${Date.now()}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new SleeperError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};

export const serverGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};

export const serverPost = async <T, U>(
    endpoint: string,
    data: U
): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};

export const serverDelete = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
        method: "DELETE",
        credentials: 'include',
    });

    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};

export const serverProtectedPost = async <T>(req: Request): Promise<T> => {
    const response = await fetch(req);
    if (response.status == 401) {
        const newTokenReq = await fetch("REFRESHROUTE");
        if (newTokenReq.status == 401) {
            const dispatch = useAppDispatch();
            dispatch(logout());
            throw new ServerError(response.status, "Session Expired, Please Login Again");
        }
        const retryReq = await fetch(req);
        return retryReq.json() as Promise<T>;
    }

    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};

export const sleeper_avatarGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${AVATAR_URL}${endpoint}`);

    if (!response.ok) {
        throw new SleeperError(response.status, response.statusText);
    }

    return response.blob() as Promise<T>;
};
