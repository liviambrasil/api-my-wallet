import "../../src/setup.js"
import connection from "../../src/database.js"
import app from "../../src/app.js"
import { clearDatabase, endConnection } from "../utils/database.js"
import { createSession, createUser } from "../factories/userFactory.js"
import { generateRegisterBody, generateSignUpBody } from "../factories/bodyFactory.js"
import supertest from 'supertest'


beforeEach (async() => {
    await clearDatabase()
})

afterAll(async() => {
    await endConnection ()
})

const agent = supertest(app)

describe('GET /registries', () => {

    const user = generateSignUpBody()

    beforeEach(async() => {
        await createUser(user)
        await createSession()
    })
    it('returns 200 for valid params', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const result = await agent.get("/registries")
                                  .set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(200);
    })
    it('returns the transactions', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token
        const id = getSessionUser.rows[0].userid

        await connection.query(`INSERT INTO records (value, description, type, userId, date)
                                VALUES ($1, $2, $3, $4, $5)`,
                                [100, 'test', '/entry', id, (new Date())])

        const result = await agent.get("/registries")
                                  .set('Authorization', `Bearer ${token}`);
        expect(result.body.length).toEqual(1);
    })
    it('returns a array of transactions in the right format', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token
        const id = getSessionUser.rows[0].userid

        await connection.query(`INSERT INTO records (value, description, type, userId, date)
                                VALUES ($1, $2, $3, $4, $5)`,
                                [100, 'test', '/entry', id, (new Date())])

        const result = await agent.get("/registries")
                                  .set('Authorization', `Bearer ${token}`);
        expect(result.body[0])
        .toEqual(expect.objectContaining({
                id: expect.any(Number),
                value: expect.any(Number),
                description: expect.any(String),
                type: expect.any(String),
                date: expect.any(String),
                userid: expect.any(Number)
            }
        ));
    })
    it('returns 401 for authentication failed (wrong token)', async() => {
        const result = await agent.get("/registries")
                                  .set('Authorization', `Bearer wrongtoken`);
        expect(result.status).toEqual(401);
    })
    it('returns 401 for authentication failed (empty token)', async() => {
        const result = await agent.get("/registries")
                                  .set('Authorization', `Bearer `);
        expect(result.status).toEqual(401);
    })

})

describe('POST /registries', () => {

    const user = generateSignUpBody()

    beforeEach(async() => {
        await createUser(user)
        await createSession()
    })
    it('returns 201 for valid params', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(201);
    })
    it('inserts a new registry in the database', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()

        await agent.post("/registries")
                    .send(body)
                    .set('Authorization', `Bearer ${token}`);

        const result = await connection.query("SELECT * FROM records")
        expect(result.rows.length).toEqual(1);
    })
    it('returns 401 for wrong token', async() => {
        const body = generateRegisterBody()

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer wrongtoken`);

        expect(result.status).toEqual(401);
    })
    it('returns 401 for invalid (not a string) token', async() => {
        const body = generateRegisterBody()

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${123}`);

        expect(result.status).toEqual(401);
    })
    it('returns 401 for empty token', async() => {
        const body = generateRegisterBody()

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer `);

        expect(result.status).toEqual(401);
    })
    it('returns 400 for invalid (not a number) value', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.value = 'string'

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for empty value', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.value = ''

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for invalid (not a string) description', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.description = 123

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for empty description', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.description = ''

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for invalid (not a string) type', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.type = 123

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for invalid (not allowed string) type', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.type = "wrongtype"

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
    it('returns 400 for empty type', async() => {
        const getSessionUser = await connection.query('SELECT * FROM sessionUsers')
        const token = getSessionUser.rows[0].token

        const body = generateRegisterBody()
        body.type = ""

        const result = await agent.post("/registries")
                                    .send(body)
                                    .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(400);
    })
})