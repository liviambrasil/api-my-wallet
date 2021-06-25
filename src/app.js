import express from "express"
import cors from "cors"
import pg from "pg"
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import connection from "./database.js";

const app = express()
app.use(cors())
app.use(express.json())


app.post('/login', async (req,res) => {
    const {email, password} = req.body

    try {
        if(!email || !password) return res.sendStatus(400) //funcionando

        const user = await connection.query('SELECT * FROM users WHERE email = $1', [email])

        if(user.rows[0] && bcrypt.compareSync(password, user.rows[0].password)) {

            const token = uuid.v4();
            const userId = user.rows[0].id
            const username = user.rows[0].name

            await connection.query(`INSERT INTO sessionUsers (userId, token) 
                                    VALUES ($1, $2)`, 
                                    [userId, token])
        
            return res.send({username, token}) //funcionando
        }
            return res.sendStatus(401) //funcionando
 
    }   
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

app.post('/signup', async (req,res) => {
    const {name, email, password} = req.body
    const passwordHash = bcrypt.hashSync(password, 10)

    try {
        if(!name || !email || !password) return res.sendStatus(400) //funcionando
        const userExists = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        if(!userExists.rows[0]){
            await connection.query(`INSERT INTO users (name, email, password) 
                                    VALUES ($1, $2, $3)`, 
                                    [name, email, `${passwordHash}`])
            return res.sendStatus(201) //funcionando
        }
        else{
            res.sendStatus(409) //funcionando
        }
    }
    catch (e){
        console.log(e)
        return res.sendStatus(404)
    }
})

app.get('/registries', async (req,res) => {
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try{
        const validateUser = await connection.query(`SELECT * 
                                                    FROM sessionUsers
                                                    WHERE token = $1`, [token])
                      
        const user = validateUser.rows[0]
        if(!validateUser.rows[0]) return res.sendStatus(401) //funcionando

        const registries = await connection.query(`SELECT * FROM records WHERE userId = $1`, [user.userid])
        return res.send(registries.rows) //funcionando
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

app.post('/registries', async (req,res) => { 

    const {value, description, type} = req.body
    const authorization = req.headers['authorization'];
    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.sendStatus(401) //funcionando

    try {
        const result = await connection.query(` SELECT * FROM sessionUsers
                                                WHERE token = $1`, [token])

        if(result.rows[0]) {
            const user = result.rows[0]
            await connection.query(`INSERT INTO records (value, description, type, userId, date)
                                    VALUES ($1, $2, $3, $4, $5)`,[value, description, type, user.userid,(new Date())])
            res.sendStatus(201) //funcionando
        }
        else {
            res.sendStatus(401) //funcionando
        }
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post('/signout', async(req,res) => { 
    const authorization = req.headers['authorization'];
    const token = authorization.replace('Bearer ', '');

    if(!token) return res.sendStatus(401) //funcionando

    try {
        await connection.query(`DELETE FROM sessionUsers 
                                WHERE token = $1`, [token])
        return res.sendStatus(204) //funcionando
    }
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

app.get('/teste', (req,res) => {
    res.sendStatus(200)
})

export default app;