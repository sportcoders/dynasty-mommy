import supertest from "supertest";
import { app, clean_db, init_app_test } from '../bootstrap'
import { testDataSource } from "../bootstrap";
import { User } from "../../models/user";
import { users } from "./utils";
import { hash } from "bcrypt";
import config from "../../config/config";
import { createToken } from "../../utils/jwt";

let api: any;
beforeAll(() => {
    init_app_test()
    api = supertest(app)
});
afterEach(async () => {
    await clean_db()
})
const loadUser = async () => {
    for (const user of users) {
        const hashed_password = await hash(user.password, config.salt_rounds)
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password, username: user.username })
        await testDataSource.getRepository(User).save(new_user)
    }
}
describe("user_attributes", () => {
    describe("addLeague", () => {
        it("should return status code of 200 when league is added successfully", async () => {
            await loadUser()
            const token = createToken({ email: users[0].email })
            const response = await api.post("/user/addLeague").set("Cookie", [`accessToken=${token}`]).send({
                league: {
                    platform: "Sleeper",
                    id: "sleeper_league_idd"
                }
            })
            expect(response.statusCode).toBe(200)
            //check to see if it exists in db
        })
        it("should return status code of 422 when request fields are not as expected", async () => {
            const token = createToken({ email: users[0].email })
            const response = await api.post("/user/addLeague").set("Cookie", [`accessToken=${token}`]).send({
                platform: "Sleeper",
                id: "sleeper_league_idd"
            })
            expect(response.statusCode).toBe(422)
        })
        it("should return status code of 401 when no auth header is sent", async () => {
            const response = await api.post("/user/addLeague").send({
                league: {
                    platform: "Sleeper",
                    id: "sleeper_league_idd"
                }
            })
            expect(response.statusCode).toBe(401)
        })
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const response = await api.post("/user/addLeague").set("Cookie", `invalidAuth`).send({
                league: {
                    platform: "Sleeper",
                    id: "sleeper_league_idd"
                }
            })
            expect(response.statusCode).toBe(401)
        })
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const token = createToken({ email: "email@doesnt.exist.com" })
            const response = await api.post("/user/addLeague").set("Cookie", [`accessToken=${token}`]).send({
                league: {
                    platform: "Sleeper",
                    id: "sleeper_league_idd"
                }
            })
            expect(response.statusCode).toBe(404)
        })
    })
})