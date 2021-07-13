import "../../src/setup.js"
import app from '../../src/app'
import connection from "../../src/database.js"
import { clearDatabase, endConnection } from "../utils/database.js"
import { generateLoginBody, generateSignUpBody } from "../factories/bodyFactory"
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import { createUser } from "../factories/userFactory.js"


beforeEach (async() => {
    await clearDatabase()
})

afterAll(async() => {
    await endConnection ()
})

const agent = supertest(app)

describe("POST /login", () => {

    const user = generateSignUpBody()

    beforeEach(async() => await createUser(user))
    
    it('returns 201 for valid params', async() => {
        const body = generateLoginBody(user);

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(200);
    })

    it('inserts a new session in the database', async() => {
        const body = generateLoginBody(user);

        const beforeInsert = await connection.query('SELECT * FROM sessionUsers');
        await agent.post("/login").send(body);
        const afterInsert = await connection.query('SELECT * FROM sessionUsers')

        expect(beforeInsert.rows.length).toEqual(0);
        expect(afterInsert.rows.length).toEqual(1);
    })

    it('returns 400 for invalid (not in a email format) email', async() => {
        const body = generateLoginBody(user);
        body.email = 'test';

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for invalid (not a string) email', async() => {
        const body = generateLoginBody(user);
        body.email = 1234;

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for empty email', async() => {
        const body = generateLoginBody(user);
        body.email = '';

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for invalid password', async() => {
        const body = generateLoginBody(user);
        body.password = 1234;

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for empty password', async() => {
        const body = generateLoginBody(user);
        body.password = '';

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 401 for wrong email', async() => {
        const body = generateLoginBody(user);
        body.email = 'wrongemail@test.br';

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(401);
    })

    it('returns 401 for wrong password', async() => {
        const body = generateLoginBody(user);
        body.password = bcrypt.hashSync(user.password, 10);

        const response = await agent.post("/login").send(body);
        expect(response.status).toEqual(401);
    })
})

describe("POST /signup", () => {

    const body = generateSignUpBody()

    it('returns 201 for valid params', async() => {
        
        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(201)
    });

    it('inserts a new user in the database', async() => {

        const beforeInsert = await connection.query('SELECT * FROM users');
        await agent.post("/signup").send(body);
        const afterInsert = await connection.query('SELECT * FROM users')

        expect(beforeInsert.rows.length).toEqual(0);
        expect(afterInsert.rows.length).toEqual(1);
    })

    it('returns 409 for duplicate email', async() => {

        await agent.post("/signup").send(body);
        const secondTry = await agent.post("/signup").send(body);
        expect(secondTry.status).toEqual(409)
    })

    it('returns 400 for invalid (not in a email format) email', async() => {
        body.email = 'test'

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid (not a string) email', async() => {
        body.email = 1234

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
    
    it('returns 400 for empty email', async() => {
        body.email = ''

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid name', async() => {
        body.name = 1234

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for empty name', async() => {
        body.name = ''

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid password', async() => {
        body.password = 1234

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for empty password', async() => {
        body.password = ''

        const result = await agent.post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
});