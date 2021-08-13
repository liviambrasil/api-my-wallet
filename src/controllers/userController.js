import joi from "joi"
import bcrypt from 'bcrypt'
import { createSessionUser, deleteSession, findUserByEmail, insertUser } from '../repositories/userRepository.js'
import * as uuid from 'uuid'

async function signup (req,res) {
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
        const userExists = await findUserByEmail(email)
        if(!userExists){
            await insertUser({name, email, passwordHash})
            return res.sendStatus(201)
        }
        else return res.sendStatus(409)
    }
    catch(e){
        console.log(e)
        return res.sendStatus(500)
    }
}

async function login (req,res) {
    const {email, password} = req.body

    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })

    const isValid = schema.validate(req.body)
    if(isValid.error) return res.sendStatus(400)

    try {
        const user = await findUserByEmail(email)
        if(!user) return res.sendStatus(401)

        if(bcrypt.compareSync(password, user.password)) {

            const token = uuid.v4();
            const userId = user.id
            const username = user.name
            await createSessionUser({userId, token})
        
            return res.send({username, token})
        }
    }   
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

async function signout (req,res) { 
    const authorization = req.headers['authorization'];
    const token = authorization.replace('Bearer ', '');

    if(!token) return res.sendStatus(401)

    try {
        await deleteSession(token)
        return res.sendStatus(204) 
    }
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export {login, signup, signout}