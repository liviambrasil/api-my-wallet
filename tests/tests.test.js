import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest'
import app from '../src/app'
import connection from '../src/database.js'

beforeEach(async () => {

})

afterAll(() => {
    connection.end();
})

describe("GET /teste", () => {

    beforeEach(async () => {
        //inserir o usuario com um token especifico em caso de usar o mesmo database
    })

    it("returns status 200 for valid params", async () => {
        const result = await supertest(app).get('/teste')
        expect(result.status).toEqual(200);
    });
}); 