import express from "express"
import cors from "cors"
import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import connection from "./database.js"
import joi from "joi"

const app = express()
app.use(cors())
app.use(express.json())

app.post('/login', async (req,res) => {
    const {email, password} = req.body

    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })

    const isValid = schema.validate(req.body)
    if(isValid.error) return res.sendStatus(400)

    try {
        const user = await connection.query('SELECT * FROM users WHERE email = $1', [email])

        if(user.rows[0] && bcrypt.compareSync(password, user.rows[0].password)) {

            const token = uuid.v4();
            const userId = user.rows[0].id
            const username = user.rows[0].name

            await connection.query(`INSERT INTO sessionUsers (userId, token) 
                                    VALUES ($1, $2)`, 
                                    [userId, token])
        
            return res.send({username, token})
        }
        
        return res.sendStatus(401)
 
    }   
    catch (e) {
        return res.sendStatus(500)
    }
})

app.post('/signup', async (req,res) => {
    const {name, email, password} = req.body

    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    })

    const isValid = schema.validate(req.body)
    if(isValid.error) return res.sendStatus(400)

    const passwordHash = bcrypt.hashSync(password, 10)

    try {
        const userExists = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        if(!userExists.rows[0]){
            await connection.query(`INSERT INTO users (name, email, password) 
                                    VALUES ($1, $2, $3)`, 
                                    [name, email, `${passwordHash}`])
            return res.sendStatus(201)
        }
        else return res.sendStatus(409)
    }
    catch(e){
        return res.sendStatus(500)
    }
})

app.get('/registries', async (req,res) => {
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    if(!token) return res.sendStatus(401)

    try {
        const validateUser = await connection.query(`SELECT * 
                                                FROM sessionUsers
                                                WHERE token = $1`, [token])
        if(!validateUser.rows.length) return res.sendStatus(401)  

        const user = validateUser.rows[0]
        
        const registries = await connection.query(`SELECT * FROM records 
                                                   WHERE userId = $1`, [user.userid])

        return res.send(registries.rows)
    }

    catch (e) {
        return res.sendStatus(500)
    }
})

app.post('/registries', async (req,res) => { 
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')
    const {value, description, type} = req.body

    if(!token) return res.sendStatus(401)

    const schema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        type: joi.string().valid("/entry", "/exit").required()
    })

    const isValid = schema.validate(req.body)
    if(isValid.error) return res.sendStatus(400)

    try {
        const validateUser = await connection.query(`SELECT * 
                                                FROM sessionUsers
                                                WHERE token = $1`, [token])
                    
        const user = validateUser.rows[0]
        if(!validateUser.rows[0]) return res.send("Erro na autenticação").status(401)
        
        await connection.query(`INSERT INTO records (value, description, type, userId, date)
                                VALUES ($1, $2, $3, $4, $5)`,
                                [value, description, type, user.userid,(new Date())])
        res.sendStatus(201)
    }
    catch (e) {
        res.sendStatus(500)
    }
})

app.post('/signout', async(req,res) => { 
    const authorization = req.headers['authorization'];
    const token = authorization.replace('Bearer ', '');

    if(!token) return res.sendStatus(401)

    try {
        await connection.query(`DELETE FROM sessionUsers 
                                WHERE token = $1`, [token])
        return res.sendStatus(204) 
    }
    catch (e) {
        return res.sendStatus(500)
    }
})


export default app;