import "../../src/setup.js"
import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest'
import app from '../../src/app'
import { clearDatabase, endConnection } from "../utils/database.js"

beforeEach (async() => {
    await clearDatabase()
})

afterAll(async() => {
    await endConnection ()
})

describe("POST /sigup", () => {

    function generateSignUpBody () {
        return {
            name: 'Test',
            email: 'test@test.br',
            password: '1234'
        }
    }

    it('returns 201 for validate params', async() => {
        const body = generateSignUpBody()
        
        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(201)
    });

    it('returns 409 for duplicate email', async() => {
        const body = generateSignUpBody()

        await supertest(app).post("/signup").send(body);
        const secondTry = await supertest(app).post("/signup").send(body);
        expect(secondTry.status).toEqual(409)
    })

    it('returns 404 for invalidate email', async() => {
        const body = generateSignUpBody()
        body.email = 'test'

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
    it('returns 404 for invalidate name', async() => {
        const body = generateSignUpBody()
        body.name = 1234

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
}); 
