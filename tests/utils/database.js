import connection from "../../src/database.js"

export async function clearDatabase () {
    await connection.query('TRUNCATE users RESTART IDENTITY')
}

export async function endConnection () {
    await clearDatabase();
    await connection.end();
}