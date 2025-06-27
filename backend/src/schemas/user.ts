import * as z from "zod/v4"

const userLogin = z.object({
    username: z.string(),
    password: z.string()
})