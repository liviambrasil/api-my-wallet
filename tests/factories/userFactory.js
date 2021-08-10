import bcrypt from 'bcrypt'
import connection from '../../src/database'

async function createUser (user) {
    return await connection.query(`INSERT INTO users (name, email, password) 
                            VALUES ($1, $2, $3)`,
                            [user.name, user.email, bcrypt.hashSync(user.password, 10)])
}

async function createSession () {
    await connection.query('INSERT INTO sessionUsers (userId, token) VALUES ($1, $2)', [1, 'rightToken']);
}


export {createUser, createSession}