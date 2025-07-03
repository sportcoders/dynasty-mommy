import { serverPost } from "@services/sleeper";

export async function DM_login(email: string, password: string) {
    try {
        const { headers } = await serverPost('/auth/login', { email: email, password: password })
        return headers
    }
    catch (e) {
        console.log(e)
    }
}
export async function DM_signup(username: string, email: string, password: string) {
    try {
        const { headers } = await serverPost('/auth/signup', { username: username, email: email, password: password })
        return headers
    }
    catch (e) {
        console.log(e)
    }
}