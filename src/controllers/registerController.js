import joi from "joi"
import { checkUserToken } from "../repositories/userRepository.js"
import { getRecords, insertRegister } from "../repositories/registerRepository.js"

async function register (req,res) { 
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
        const user = await checkUserToken(token)
        if(!user) return res.sendStatus(401)
        
        await insertRegister({value, description, type, user})
        res.sendStatus(201)
    }

    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

async function getRegistries (req,res) {
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    if(!token) return res.sendStatus(401)

    try {
        const user = await checkUserToken(token)
        if(!user) return res.sendStatus(401)  
        
        const registries = await getRecords(user)

        return res.send(registries)
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export {register, getRegistries}