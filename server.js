import express from "express"
import cors from "cors"
import pg from "pg"

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

app.post('/login', (req,res) => {
    res.sendStatus(201)
})

app.post('/signup', (req,res) => {
    const {name, email, password} = req.body
    res.sendStatus(201)
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