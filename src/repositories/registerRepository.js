import connection from "../database.js"

async function insertRegister ({value, description, type, user}) {
    return await connection.query(`INSERT INTO records (value, description, type, userId, date)
                                VALUES ($1, $2, $3, $4, $5)`,
                                [value, description, type, user.userid,(new Date())])
}
async function getRecords (user) {
    const records = await connection.query(`SELECT * FROM records 
                                                   WHERE userId = $1`, [user.userid])
    return records.rows
}
export { insertRegister, getRecords }