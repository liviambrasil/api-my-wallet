import "../../src/setup.js"
import app from '../../src/app'
import connection from "../../src/database.js"
import { clearDatabase, endConnection } from "../utils/database.js"
import { generateLoginBody, generateSignUpBody } from "../utils/login.js"
import supertest from 'supertest'
import bcrypt from 'bcrypt'


beforeEach (async() => {
    await clearDatabase()
})

afterAll(async() => {
    await endConnection ()
})

describe("POST /login", () => {

    const user = generateSignUpBody()

    beforeEach(async() => {
        await connection.query(`INSERT INTO users (name, email, password) 
                                VALUES ($1, $2, $3)`,
                                [user.name, user.email, bcrypt.hashSync(user.password, 10)])
    })
    
    it('returns 201 for valid params', async() => {
        const body = generateLoginBody(user);

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(200);
    })

    it('inserts a new session in the database', async() => {
        const body = generateLoginBody(user);

        const beforeInsert = await connection.query('SELECT * FROM sessionUsers');
        await supertest(app).post("/login").send(body);
        const afterInsert = await connection.query('SELECT * FROM sessionUsers')

        expect(beforeInsert.rows.length).toEqual(0);
        expect(afterInsert.rows.length).toEqual(1);
    })

    it('returns 400 for invalid email', async() => {
        const body = generateLoginBody(user);
        body.email = 'test';

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for invalid (not a string) email', async() => {
        const body = generateLoginBody(user);
        body.email = 1234;

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for invalid password', async() => {
        const body = generateLoginBody(user);
        body.password = 1234;

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 400 for empty password', async() => {
        const body = generateLoginBody(user);
        body.password = '';

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(400);
    })

    it('returns 401 for wrong email', async() => {
        const body = generateLoginBody(user);
        body.email = 'wrongemail@test.br';

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(401);
    })

    it('returns 401 for wrong password', async() => {
        const body = generateLoginBody(user);
        body.password = bcrypt.hashSync(user.password, 10);

        const response = await supertest(app).post("/login").send(body);
        expect(response.status).toEqual(401);
    })
})

describe("POST /sigup", () => {

    it('returns 201 for valid params', async() => {
        const body = generateSignUpBody()
        
        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(201)
    });

    it('inserts a new user in the database', async() => {
        const body = generateSignUpBody()

        const beforeInsert = await connection.query('SELECT * FROM users');
        await supertest(app).post("/signup").send(body);
        const afterInsert = await connection.query('SELECT * FROM users')

        expect(beforeInsert.rows.length).toEqual(0);
        expect(afterInsert.rows.length).toEqual(1);
    })

    it('returns 409 for duplicate email', async() => {
        const body = generateSignUpBody()

        await supertest(app).post("/signup").send(body);
        const secondTry = await supertest(app).post("/signup").send(body);
        expect(secondTry.status).toEqual(409)
    })

    it('returns 400 for invalid (not in a email format) email', async() => {
        const body = generateSignUpBody()
        body.email = 'test'

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid (not a string) email', async() => {
        const body = generateSignUpBody()
        body.email = 1234

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
    
    it('returns 400 for empty email', async() => {
        const body = generateSignUpBody()
        body.email = ''

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid name', async() => {
        const body = generateSignUpBody()
        body.name = 1234

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for empty name', async() => {
        const body = generateSignUpBody()
        body.name = ''

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for invalid password', async() => {
        const body = generateSignUpBody()
        body.password = 1234

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })

    it('returns 400 for empty password', async() => {
        const body = generateSignUpBody()
        body.password = ''

        const result = await supertest(app).post("/signup").send(body);
        expect(result.status).toEqual(400)
    })
});