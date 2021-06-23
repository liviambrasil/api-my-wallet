import express from "express"
import cors from "cors"
import pg from "pg"
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';

const app = express()
app.use(cors())
app.use(express.json())

const { Pool } = pg;

const connection = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'mywallet'
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body
    const user = await connection.query('SELECT * FROM users WHERE email = $1', [email])

    try {
        if(user.rows[0] && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = uuid.v4();

            await connection.query(`INSERT INTO sessionUser (token, userId) 
                                    VALUES ($1, $2)`, 
                                    [token, user.rows[0].id])
        
            return res.send(token)
        }
    }   
    catch {
        res.sendStatus(500)
    }
})

app.post('/signup', async (req,res) => {
    const {name, email, password} = req.body
    const passwordHash = bcrypt.hashSync(password, 10)

    try {
        const userExists = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        if(!userExists.rows[0]){
            await connection.query(`INSERT INTO users (name, email, password) 
                                    VALUES ($1, $2, $3)`, 
                                    [name, email, `${passwordHash}`])
            return res.sendStatus(201)
        }
        else{
            res.sendStatus(409)
        }
    }
    catch (e){
        console.log(e)
        return res.sendStatus(404)
    }
})

app.get('/home', (req,res) => {
})

app.post('/entry', (_req,res) => {
    res.sendStatus(201)
})

app.post('/exit', (req,res) => {
    // req.body { value, description }
})

app.listen(4000);