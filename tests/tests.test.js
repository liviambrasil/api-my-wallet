import "../src/setup.js"
import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest'
import app from '../src/app'
import connection from '../src/database'


beforeEach(async () => {
    await connection.query('DELETE FROM users WHERE email = $1', ['test@test.br'])
})

afterAll(() => {
    connection.end();
})

describe("POST /sigup", () => {
    it('returns 201 for validate params', async() => {
        const body = {
            name: 'Test',
            email: 'test@test.br',
            password: '1234'
        }    
        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(201)
    });

    it('returns 409 for duplicate email', async() => {
        const body = {
            name: 'Test',
            email: 'test@test.br',
            password: '1234'
        }
        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(201)

        const secondTry = await supertest(app).post("/signup").send(body);
        expect(secondTry.status).toEqual(409)
    })

    it('returns 404 for invalidate email', async() => {
        const body = {
            name: 'Test',
            email: 'test',
            password: '1234'
        }
        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(404)
    })
    it('returns 404 for invalidate name', async() => {
        const body = {
            name: 1234,
            email: 'test',
            password: '1234'
    }
    const result = await supertest(app).post("/signup").send(body);
    expect(result.status).toEqual(404)
    })

}); 
