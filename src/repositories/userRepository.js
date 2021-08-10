import connection from "../database"

async function checkUserToken (token) {
    const validateUser = await connection.query(`SELECT * 
                                                FROM sessionUsers
                                                WHERE token = $1`, [token])
    if(!validateUser.rows.length) return false                
    return validateUser.rows[0]
}

async function findUserByEmail (email) {
    const user = await connection.query('SELECT * FROM users WHERE email = $1', [email])
    if(!user.rows.length) return false
    return user.rows[0]
}

async function insertUser ({name, email, passwordHash}) {
    return await connection.query (`INSERT INTO users (name, email, password) 
                                    VALUES ($1, $2, $3)`, 
                                    [name, email,`${passwordHash}`])
}

async function createSessionUser ({userId, token}) {
    return await connection.query(`INSERT INTO sessionUsers (userId, token) 
                                    VALUES ($1, $2)`, 
                                    [userId, token])
}

async function deleteSession (token) {
    return await connection.query(`DELETE FROM sessionUsers 
                                WHERE token = $1`, [token])
}

export {findUserByEmail, checkUserToken, insertUser, createSessionUser, deleteSession}