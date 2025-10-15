import supertest from "supertest";
import { app, clean_db, init_app_test } from '../bootstrap';
import { testDataSource } from "../bootstrap";
import { User } from "../../models/user";
import { users, yahooLeagues } from "./utils";
import { hash } from "bcrypt";
import config from "../../config/config";
import { AccessToken, createToken, RefreshToken } from "../../utils/jwt";
import { YahooLeague } from "../../models/yahoo_league";
import { YahooToken } from "../../models/yahoo_tokens";
import { encrypt, decrypt } from "../../utils/symmetric_encryption";

let api: any;
beforeAll(() => {
    init_app_test();
    api = supertest(app);
});

afterEach(async () => {
    await clean_db();
});
const YAHOO_API_URL = `https://fantasysports.yahooapis.com/fantasy/v2`;
const yahooTokens = { access_token: encrypt("access"), refresh_token: encrypt("refresh"), access_token_expiry: new Date(Date.now() + 60 * 60 * 1000) };

// (global.fetch as jest.Mock).mockImplementation((url) => {
//     if (url == `${YAHOO_API_URL}/`) {
//         return {

//         };
//     }
// });
const loadUser = async () => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const hashed_password = await hash(user.password, config.salt_rounds);
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password, username: user.username });
        await testDataSource.getRepository(User).save(new_user);
        users[i].id = new_user.id;
    }
};
const loadUserWithLinkedAccount = async () => {
    const user = users[0];
    const hashed_password = await hash(user.password, config.salt_rounds);
    const new_user = await testDataSource.getRepository(User).save({ email: user.email, password: hashed_password, username: user.username });
    await testDataSource.getRepository(YahooToken).save({ ...yahooTokens, userId: new_user.id });
    const accessTokenPayload: AccessToken = { email: users[0].email, id: new_user.id, type: 'access' };
    const token = createToken(accessTokenPayload);
    return token;
};

const loadUserWithLeagues = async () => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const hashed_password = await hash(user.password, config.salt_rounds);
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password, username: user.username });
        await testDataSource.getRepository(User).save(new_user);
        const leagues = [];
        users[i].id = new_user.id;
        await testDataSource.getRepository(YahooToken).save({ ...yahooTokens, userId: users[i].id });
        for (const league of yahooLeagues) {
            leagues.push(testDataSource.getRepository(YahooLeague).save({ league_key: league.league_key, userId: new_user.id, yahoo_token_userId: new_user.id }));
        }
        await Promise.all(leagues);
    }
};
const createAccessToken = () => {
    const accessTokenPayload: AccessToken = { email: users[0].email, id: users[0].id, type: 'access' };
    const token = createToken(accessTokenPayload);
    return token;
};
describe("yahoo_league", () => {
    describe("all saved yahoo leagues", () => {
        it("should return all saved leagues for a user", async () => {
            await loadUserWithLeagues();
            const token = createAccessToken();

            const response = await api.get("/yahoo/league/allSaved").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(yahooLeagues.map((league) => ({ platform: "yahoo", league_key: league.league_key })));
        });

        it("should return empty array/null when user doesn't have saved leagues", async () => {
            const token = await loadUserWithLinkedAccount();

            const response = await api.get("/yahoo/league/allSaved").set("Cookie", [`accessToken=${token}`]).send();

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("authenticate middleware tests", () => {
        it("should return 401 unauthorized when header is missing", async () => {
            const response = await api.get("/yahoo/league/allSaved").send();

            expect(response.statusCode).toBe(401);
        });
        it("should return 401 when token is invalid", async () => {
            const response = await api.get("/yahoo/league/allSaved").set("Cookie", ['accessToken=invalidToken']).send();

            expect(response.statusCode).toBe(401);
        });
    });

    describe("save league", () => {
        it("should return status 200 when league is saved successfully", async () => {
            const token = await loadUserWithLinkedAccount();
            const response = await api.post("/yahoo/league").set("Cookie", [`accessToken=${token}`]).send({ league: { league_key: "newleaugekey" } });
            expect(response.statusCode).toBe(200);
        });
        it("should return status 422 when body is not as expected", async () => {
            const token = await loadUserWithLinkedAccount();

            const response = await api.post("/yahoo/league").set("Cookie", [`accessToken=${token}`]).send({ league: { league_id: "newleaugekey" } });
            expect(response.statusCode).toBe(422);
        });
    });

    describe("unlink", () => {
        it("should return status 204 when yahoo account is unlinked successfully", async () => {
            const token = await loadUserWithLinkedAccount();
            const response = await api.delete("/yahoo/unlink").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(204);

        });
        it("should return status 404 when user doesn't have an account currently linked", async () => {
            const token = createAccessToken();
            const response = await api.delete("/yahoo/unlink").set("Cookie", [`accessToken=${token}`]).send();
            expect(response.statusCode).toBe(404);
        });
    });
});

describe("yahoo api calls", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getting yahoo leagues", () => {
        it("should return status 200 when a users leagues are fetched", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue(`
                    <fantasy_content>
                    <users>
                        <user>
                        <games>
                        <game>
                        <leagues> 
                            <league>
                                <league_key>223.l.431</league_key> 
                                <league_id>431</league_id> 
                                <name>Y! Friends and Family League</name> 
                                <url>https://football.fantasysports.yahoo.com/archive/pnfl/2009/431</url> 
                                <draft_status>postdraft</draft_status> <num_teams>14</num_teams> 
                                <edit_key>17</edit_key> <weekly_deadline/> 
                                <league_update_timestamp>1262595518</league_update_timestamp> 
                                <scoring_type>head</scoring_type> 
                                <current_week>16</current_week>
                                <start_week>1</start_week> 
                                <end_week>16</end_week> 
                                <is_finished>1</is_finished> 
                            </league>
                         </leagues>
                        </game>
                        </games>
                        </user>
                    </users>
                    </fantasy_content>`)
            });
            const token = await loadUserWithLinkedAccount();
            const response = await api.get("/yahoo/leagues").set("Cookie", [`accessToken=${token}`]).send();
            const yahooAccessToken = "access";
            expect(fetch).toHaveBeenCalledWith(
                `${YAHOO_API_URL}/users;use_login=1/games;game_keys=nba/leagues`,
                expect.objectContaining(
                    {
                        headers: { Authorization: `Bearer ${yahooAccessToken}` },
                    })
            );
            expect(response.statusCode).toBe(200);
        }
        );

        it("should return status 200 when there are no leagues for the user", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue(`
                    <fantasy_content>
                      <users>
                        <user>
                        <games>
                            <game>
                            <game_key>nba</game_key>
                            <leagues/>
                            </game>
                        </games>
                        </user>
                    </users>
                    </fantasy_content>`)
            });

            const token = await loadUserWithLinkedAccount();
            const response = await api.get("/yahoo/leagues").set("Cookie", [`accessToken=${token}`]).send();
            const yahooAccessToken = "access";
            expect(fetch).toHaveBeenCalledWith(
                `${YAHOO_API_URL}/users;use_login=1/games;game_keys=nba/leagues`,
                expect.objectContaining(
                    {
                        headers: { Authorization: `Bearer ${yahooAccessToken}` },
                    })
            );
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ leagues: [null] });
        });
    });

});