require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

exports.pool = pool

exports.query = (text, params) => pool.query(text, params)

exports.connectToDB = async () => {
    try {
        await pool.query('SELECT 1')
        console.log('connected to DB')
    } catch (error) {
        console.log(error)
    }
}
