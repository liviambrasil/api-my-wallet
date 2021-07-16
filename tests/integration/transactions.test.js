import "../../src/setup.js"
import connection from "../../src/database.js"
import app from "../../src/app.js"
import { clearDatabase, endConnection } from "../utils/database.js"
import { createUser } from "../factories/userFactory.js"
import { generateLoginBody, generateSignUpBody } from "../factories/bodyFactory.js"
import supertest from 'supertest'


beforeEach (async() => {
    await clearDatabase()
})

afterAll(async() => {
    await endConnection ()
})

describe('GET /registries', () => {

    const agent = supertest(app)

    const user = generateSignUpBody()

    beforeEach(async() => {
        await createUser(user)
        const body = generateLoginBody(user);
        
        await agent.post("/login").send(body);
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

    // it('returns 401 for authentication failed (wrong token)', async() => {

    // })
    // it('returns 401 for authentication failed (empty token)', async() => {

    // })
})