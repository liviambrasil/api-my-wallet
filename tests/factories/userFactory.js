import bcrypt from 'bcrypt'
import connection from '../../src/database'

export async function createUser (user) {
    await connection.query(`INSERT INTO users (name, email, password) 
                            VALUES ($1, $2, $3)`,
                            [user.name, user.email, bcrypt.hashSync(user.password, 10)])
}