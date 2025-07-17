import * as z from "zod/v4"

export const userLogin = z.object({
    email: z.string(),
    password: z.string()
})

export const addUserToLeagueSchema = z.object({
    league: z.object({
        platform: z.string(),
        league_id: z.string()
    })
})

export const userSignUp = z.object({
    email: z.email(),
    password: z.string(),
    username: z.string()
})
export const deleteUserLeagueSchema = z.object({
    platform: z.string(),
    league_id: z.string()
})