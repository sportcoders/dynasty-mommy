import { useAppDispatch } from "@app/hooks";
import { store } from "@app/store/store";
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

export const serverGet = async <T>(endpoint: string): Promise<T | null> => {

    const response = await refetch(`${SERVER_BASE_URL}${endpoint}`, "GET");

    if (response.status == 401) {
        store.dispatch(logout());
        return null;
    }
    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }
    if (response.status == 204) return null;

    return response.json() as Promise<T>;
};

export const serverPost = async <T, U>(
    endpoint: string,
    data: U
): Promise<T> => {
    const response = await refetch(`${SERVER_BASE_URL}${endpoint}`, "POST", false, data);
    if (response.status == 401) {
        store.dispatch(logout());
    }
    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};
export const serverPatch = async <T, U>(endpoint: string, data: U): Promise<T | null> => {
    const response = await refetch(`${SERVER_BASE_URL}${endpoint}`, "PATCH", false, data
    );
    if (response.status == 204) return null;
    if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
};
export const serverDelete = async <T>(endpoint: string): Promise<T | null> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
        method: "DELETE",
        credentials: 'include',
    });
    if (response.status == 204) return null;
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
type HTTP_METHODS = "POST" | "PATCH" | "GET";
export const refetch = async (endpoint: string, method: HTTP_METHODS, refreshed = false, data?: any): Promise<Response> => {
    const response = await fetch(endpoint, {
        method: method,
        credentials: 'include',
        body: data !== undefined ? JSON.stringify(data) : undefined,
        headers: data !== undefined ? { "Content-Type": "application/json" } : undefined,

    });
    if (response.status == 401 && !refreshed) {
        //getting new access token
        const refreshRes = await fetch(`${SERVER_BASE_URL}${import.meta.env.VITE_BACKEND_REFRESH}`, { credentials: 'include' });
        if (refreshRes.status != 200) {
            store.dispatch(logout());
            throw new ServerError(refreshRes.status, 'Token refresh failed');
        }

        return refetch(endpoint, method, true, data);
    }
    return response;
};
