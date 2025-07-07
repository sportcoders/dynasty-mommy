import { serverGet, serverPost } from "@services/sleeper";
interface DM_user {
    username: string
}
export async function DM_login(email: string, password: string) {
    try {
        const user = await serverPost('/auth/login', { email: email, password: password })
        console.log(user)
        return user as DM_user
    }
    catch (e) {
        console.log(e)
    }
}
export async function DM_signup(username: string, email: string, password: string) {
    try {
        const user = await serverPost('/auth/signup', { username: username, email: email, password: password })
        return user as DM_user
    }
    catch (e) {
        console.log(e)
    }
}
export interface DM_saveLeagueInfo {
    platform: string,
    id: string
}
export async function DM_saveLeague(league_info: DM_saveLeagueInfo) {
    try {
        await serverPost("/user/addLeague", { league: league_info })
    }
    catch (e) {
        console.error(e)
    }
}
export interface DM_getUserLeagues {
    leagues: { platform: string, league_id: string }[]
}
export async function DM_getLeagues() {
    try {
        const response = await serverGet<DM_getUserLeagues>("/user/getLeagues")
        return response
    }
    catch (e) {
        console.error(e)
    }
}