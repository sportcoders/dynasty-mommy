import supertest from "supertest";
import { app, init_app_test } from '../bootstrap'
import { testDataSource } from "../bootstrap";
import { User } from "../../models/user";
import { users } from "./utils";
import { hash } from "bcrypt";
import config from "../../config/config";

let api: any;
// beforeAll(async () => {
//     const app = init_app(testDataSource);
//     api = supertest(app);
// });
beforeAll(() => {
    init_app_test()
    api = supertest(app)
});
const loadUser = async () => {
    for (const user of users) {
        const hashed_password = await hash(user.password, config.salt_rounds)
        const new_user = testDataSource.getRepository(User).create({ email: user.email, password: hashed_password })
        await testDataSource.getRepository(User).save(new_user)
    }
}

describe('login', () => {
    it('should return a status code 200 when user is logged in successfully', async () => {
        await loadUser()
        const response = await api.post('/auth/login').send({
            email: users[0].email,
            password: users[0].password
        })
        expect(response.statusCode).toBe(200)
        expect(response.headers).toHaveProperty("authentication")
        expect(response.headers.authentication).toMatch(/Bearer/)
    })
    it('should return a status code of 422 when the body of the request is missing fields', async () => {
        const response = await api.post('/auth/login').send({
            email: "anemail",
            wrongfield: "wrong"
        })

        expect(response.statusCode).toBe(422)
    })
})
describe('signup', () => {
    it('should return a status code of 201 when a user is create successfully', async () => {
        const response = await api.post("/auth/signup").send({
            email: "newemail@gmail.com",
            password: "asecurepassword"
        })
        expect(response.statusCode).toBe(201)
        expect(response.headers).toHaveProperty("authentication")
        expect(response.headers.authentication).toMatch(/Bearer/)
    })
    it('should return a status code of 400 when a user already exists in db', async () => {
        const response = await api.post("/auth/signup").send({
            email: users[0].email,
            password: "asecurepassword"
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return a status code of 422 when the body of the request is missing fields', async () => {
        const response = await api.post('/auth/signup').send({
            email: "anemail@gmail.com",
        })
        expect(response.statusCode).toBe(422)
    })
})