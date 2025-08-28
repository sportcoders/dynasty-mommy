import supertest from "supertest";
import { app, clean_db, init_app_test } from '../bootstrap';
import { testDataSource } from "../bootstrap";
import { User } from "../../models/user";
import { users } from "./utils";
import { hash } from "bcrypt";
import config from "../../config/config";
import { AccessToken, createToken, RefreshToken } from "../../utils/jwt";
import UserSession from "../../models/session";
import { SleeperLeague } from "../../models/sleeper_league";

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
            leagues.push(testDataSource.getRepository(SleeperLeague).save({ user: new_user, league_id: league.league_id, userId: new_user.id, saved_user: league.saved_user }));
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

describe("sleeper_leagues", () => {
    describe("addLeague", () => {
        it("should return status code of 200 when league is added successfully", async () => {
            await loadUser();
            const token = createAccessToken();
            const response = await api.post("/sleeper_league/").set("Cookie", [`accessToken=${token}`]).send({
                league: {
                    platform: "Sleeper",
                    league_id: "sleeper_league_idd"
                }
            });
            expect(response.statusCode).toBe(200);
        });
        it("should return status code of 422 when request fields are not as expected", async () => {
            const token = createAccessToken();

            const response = await api.post("/sleeper_league/").set("Cookie", [`accessToken=${token}`]).send({
                platform: "Sleeper",
                league_id: "sleeper_league_idd"
            });
            expect(response.statusCode).toBe(422);
        });
        it("should return status code of 401 when no auth header is sent", async () => {
            const response = await api.post("/sleeper_league/").send({
                league: users[0].leagues[0]
            });
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const response = await api.post("/sleeper_league/").set("Cookie", `invalidAuth`).send({
                league: users[0].leagues[0]
            });
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const token = createAccessToken();

            const response = await api.post("/sleeper_league/").set("Cookie", [`accessToken=${token}`]).send({
                league: users[0].leagues[0]
            });
            expect(response.statusCode).toBe(404);
        });
    });

    describe("getLeague", () => {
        it("should return 200 when leagues are retreived", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();

            const response = await api.get("/sleeper_league/").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(200);
            console.log(response.body);
            expect(response.body).toHaveProperty("leagues");
            expect(users[0].leagues).toMatchObject(response.body.leagues);
        });
        it("should return status code of 401 when no auth header is sent", async () => {
            const response = await api.get("/sleeper_league/").send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const response = await api.get("/sleeper_league/").set("Cookie", `invalidAuth`).send({});
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const token = createAccessToken();

            const response = await api.get("/sleeper_league/").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
    });

    describe("deleteLeague", () => {
        it("should return status code of 200 when league is deleted successfully", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();
            const league = users[0].leagues[0];
            const response = await api.delete(`/sleeper_league/${league.league_id}`).set("Cookie", [`accessToken=${token}`]).send();

            expect(response.statusCode).toBe(200);
        });
        it("should return status code of 401 when no auth header is sent", async () => {
            const league = users[0].leagues[0];
            const response = await api.delete(`/sleeper_league/${league.league_id}`).send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 401 when invalid auth header is sent", async () => {
            const league = users[0].leagues[0];
            const response = await api.delete(`/sleeper_league/${league.league_id}`).set("Cookie", `invalidAuth`).send();
            expect(response.statusCode).toBe(401);
        });
        it("should return status code of 404 when user belonging to header doesn't exist", async () => {
            const league = users[0].leagues[0];
            const token = createAccessToken();
            const response = await api.delete(`/sleeper_league/${league.league_id}`).set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
        it("should return status code of 404 when request is missing league_id", async () => {
            //404 since the path isn't matched
            await loadUserWithLeagues();
            const token = createAccessToken();
            const response = await api.delete('/sleeper_league/').set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
        it("should return status code of 404 when leauge user is trying to delete a league that doesn't exist", async () => {
            await loadUser();
            const league = users[0].leagues[0];
            const token = createAccessToken();
            const response = await api.delete(`/sleeper_league/${league.league_id}`).set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
    }),



        describe('save teams', () => {
            it("should return status code of 200 when team is changed successfully", async () => {

                await loadUserWithLeagues();
                const token = createAccessToken();
                const response = await api.post('/sleeper_league/').set("Cookie", [`accessToken=${token}`]).send({
                    league: {
                        league_id: users[0].leagues[0].league_id,
                        user_id: "newrosterId"
                    }
                });
                expect(response.statusCode).toBe(200);
            });
        });
});