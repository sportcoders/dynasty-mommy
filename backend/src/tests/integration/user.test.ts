import supertest from "supertest";
import { app, clean_db, init_app_test } from '../bootstrap';
import { testDataSource } from "../bootstrap";
import { User, UserLeagues } from "../../models/user";
import { users } from "./utils";
import { hash } from "bcrypt";
import config from "../../config/config";
import { AccessToken, createToken, RefreshToken } from "../../utils/jwt";
import UserSession from "../../models/session";

let api: any;
beforeAll(() => {
    init_app_test();
    api = supertest(app);
});

afterEach(async () => {
    await clean_db();
});

const loadUser = async () => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const hashed_password = await hash(user.password, config.salt_rounds);
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password, username: user.username });
        await testDataSource.getRepository(User).save(new_user);
        users[i].id = new_user.id;
    }
};

const loadUserWithLeagues = async () => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const hashed_password = await hash(user.password, config.salt_rounds);
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password, username: user.username });
        await testDataSource.getRepository(User).save(new_user);
        const leagues = [];
        users[i].id = new_user.id;
        for (const league of user.leagues) {
            leagues.push(testDataSource.getRepository(UserLeagues).save({ user: new_user, league_id: league.league_id, platform: league.platform, userId: new_user.id, saved_user: league.saved_user }));
        }
        await Promise.all(leagues);
    }
};

const createAccessToken = () => {
    const accessTokenPayload: AccessToken = { email: users[0].email, id: users[0].id, type: 'access' };
    const token = createToken(accessTokenPayload);
    return token;
};

const createRefreshToken = async () => {
    const session = await UserSession.insertOne({ userEmail: users[0].email, userId: users[0].id, useUsername: users[0].username });
    const refreshTokenPayload: RefreshToken = { type: 'refresh', session_id: session._id.toString() };
    const refreshToken = createToken(refreshTokenPayload);
    return refreshToken;
};

describe("user_leagues", () => {
    describe("getLeague", () => {
        it("should return 200 when leagues are retreived", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();

            const response = await api.get("/user/getLeagues").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("leagues");
            expect(users[0].leagues).toMatchObject(response.body.leagues);
        });
        it("should return status code of 401 when no auth header is sent", async () => {
            const response = await api.get("/user/getLeagues").send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const response = await api.get("/user/getLeagues").set("Cookie", `invalidAuth`).send({});
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const token = createAccessToken();

            const response = await api.get("/user/getLeagues").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
    });

    describe("change username", () => {
        it("should return status code 200 when username is changed", async () => {
            await loadUser();

            const token = createAccessToken();
            const response = await api.patch(`/user/username`).set("Cookie", [`accessToken=${token}`]).send({ new_username: 'modified_username' });
            expect(response.statusCode).toBe(200);
        });
        it("should return status code 200 when username is changed to the same value", async () => {
            await loadUser();

            const token = createAccessToken();
            const response = await api.patch(`/user/username`).set("Cookie", [`accessToken=${token}`]).send({ new_username: users[0].username });
            expect(response.statusCode).toBe(200);
        });
        it("should return status code 409 when username is already taken", async () => {
            await loadUser();

            const token = createAccessToken();
            const response = await api.patch(`/user/username`).set("Cookie", [`accessToken=${token}`]).send({ new_username: users[1].username });
            expect(response.statusCode).toBe(409);
        });
        it("should return status code of 401 when no auth header is sent", async () => {
            const response = await api.patch(`/user/username`).send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const response = await api.patch(`/user/username`).set("Cookie", `invalidAuth`).send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const token = createAccessToken();
            const response = await api.patch(`/user/username`).set("Cookie", [`accessToken=${token}`]).send({ new_username: users[1].username });
            expect(response.statusCode).toBe(404);
        });
        it("should return status code of 422 when fields aren't as expected", async () => {
            await loadUser();
            const token = createAccessToken();
            const response = await api.patch(`/user/username`).set("Cookie", [`accessToken=${token}`]).send({ username: users[1].username });
            expect(response.statusCode).toBe(422);
        });
    });


    describe('check is user league', () => {
        it("should return true when user has the league saved", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();
            const league = users[0].leagues[0];

            const response = await api.get(`/user/isUserLeague/${league.league_id}/${league.platform}`)
                .set("Cookie", [`accessToken=${token}`])
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(true);
        });

        it("should return false when user doesn't have the league saved", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();

            const nonExistentLeague = {
                league_id: "999999999",
                platform: "sleeper"
            };

            const response = await api.get(`/user/isUserLeague/${nonExistentLeague.league_id}/${nonExistentLeague.platform}`)
                .set("Cookie", [`accessToken=${token}`])
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(false);
        });

        it("should return false when user has no leagues at all", async () => {
            await loadUser();
            const token = createAccessToken();
            const league = users[0].leagues[0];

            const response = await api.get(`/user/isUserLeague/${league.league_id}/${league.platform}`)
                .set("Cookie", [`accessToken=${token}`])
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(false);
        });

        it("should return 401 when no auth token is provided", async () => {
            const league = users[0].leagues[0];

            const response = await api.get(`/user/isUserLeague/${league.league_id}/${league.platform}`)
                .send();

            expect(response.statusCode).toBe(401);
        });

        it("should return 404 when user doesn't exist", async () => {
            const token = createAccessToken();
            const league = users[0].leagues[0];

            const response = await api.get(`/user/isUserLeague/${league.league_id}/${league.platform}`)
                .set("Cookie", [`accessToken=${token}`])
                .send();

            expect(response.statusCode).toBe(404);
        });
    });
});