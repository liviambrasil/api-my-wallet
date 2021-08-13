import express from "express"
import cors from "cors"
import { login, signout, signup } from "./controllers/userController.js"
import { getRegistries, register } from "./controllers/registerController.js"

const app = express()
app.use(cors())
app.use(express.json())

app.post('/login', login)
app.post('/signup', signup)
app.get('/registries', getRegistries)
app.post('/registries', register)
app.post('/signout', signout)


export default app;