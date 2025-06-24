import { expect } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest';
import { HttpError, HttpSuccess } from '../../constants/constants';
import Player_Sleeper from '../../models/player_sleeper';
import { players } from './utils';
import { User } from '../../types/user';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}
const api = supertest(app)

const loadPlayers = async () => {
    await Player_Sleeper.insertMany(players)
}
describe('player_sleeper', () => {

    it("should return success and player info for one player id", async () => {
        await loadPlayers()
        const response = await api.get(`/sleeper_player/${players[0].id}`)

        expect(response.status).toBe(HttpSuccess.OK)
        expect(response.body.missing_values).toBeFalsy()

        const playersRet = response.body.players

        expect(playersRet.length).toBe(1)

        const player = playersRet[0]
        delete player._id
        delete player.__v
        expect(player).toEqual(players[0])
    })

    it("should return success and all players for multiple player ids", async () => {
        await loadPlayers()
        const response = await api.get(`/sleeper_player/${players[0].id}&${players[1].id}`)

        expect(response.status).toBe(HttpSuccess.OK)
        expect(response.body.missing_values).toBeFalsy()
        expect(response.body.players.length).toEqual(players.length)

        const body = response.body.players[0]
        for (let i = 0; i < body.length; i++) {
            const player = body[i]
            delete player._id
            delete player.__v
            expect(player).toEqual(players[i])
        }
    })

    it("should return the player that exists in the database and missing value for the id that doesn't", async () => {
        await loadPlayers()
        const missingId = "9999"
        const response = await api.get(`/sleeper_player/${missingId}&${players[0].id}`)
        expect(response.statusCode).toBe(HttpSuccess.PARTIAL_CONTENT)
        expect(response.body.missing_values).toBeTruthy()
        expect(response.body.missing_ids).toContain(missingId)
        const player = response.body.players[0]
        delete player._id
        delete player.__v
        expect(player).toEqual(players[0])

    })

    it("should return 422 error code for invalid player id format", async () => {
        const response = await api.get('/sleeper_player/10512')

        expect(response.statusCode).toBe(HttpError.UNPROCESSABLE_ENTITY)
        expect(response.body).toEqual({ "message": "Invalid ID Format" })
    })

    it("should return 404 error code when nothing is provided", async () => {
        const response = await api.get('/sleeper_player/')

        expect(response.statusCode).toBe(HttpError.NOT_FOUND)
    })
})