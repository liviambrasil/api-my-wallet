import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.post('/login', (req,res) => {
    // req.body { email, password } 
})

app.post('/signup', (req,res) => {
    // req.body { name, email, password }
})

app.get('/home', (req,res) => {
})

app.post('/entry', (req,res) => {
    // req.body { value, description }
})

app.post('/exit', (req,res) => {
    // req.body { value, description }
})

app.listen(4000);