const { query } = require('../database/db')

const COLUMNS = 'id, name, email, password, is_verified, is_admin, is_guest, wallet_balance, loyalty_points, created_at, updated_at'

const shape = (row) => row && ({
    _id: String(row.id),
    name: row.name,
    email: row.email,
    password: row.password,
    isVerified: row.is_verified,
    isAdmin: row.is_admin,
    isGuest: row.is_guest,
    walletBalance: Number(row.wallet_balance),
    loyaltyPoints: row.loyalty_points,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})

exports.findByEmail = async (email) => {
    const { rows } = await query(`SELECT ${COLUMNS} FROM users WHERE email = $1`, [email])
    return shape(rows[0])
}

exports.findById = async (id) => {
    const { rows } = await query(`SELECT ${COLUMNS} FROM users WHERE id = $1`, [id])
    return shape(rows[0])
}

// isVerified defaults true — the OTP email-verification flow isn't part of
// this phase (it lived on the now-parked Mongoose OTP model).
exports.create = async ({ name, email, password, isGuest = false, isVerified = true }) => {
    const { rows } = await query(
        `INSERT INTO users (name, email, password, is_guest, is_verified) VALUES ($1,$2,$3,$4,$5) RETURNING ${COLUMNS}`,
        [name, email, password, isGuest, isVerified]
    )
    return shape(rows[0])
}

const FIELD_COLUMNS = {
    name: 'name',
    email: 'email',
    password: 'password',
    isVerified: 'is_verified',
    isAdmin: 'is_admin',
    walletBalance: 'wallet_balance',
    loyaltyPoints: 'loyalty_points',
}

exports.updateById = async (id, fields) => {
    const sets = []
    const values = []
    Object.entries(fields).forEach(([key, value]) => {
        const column = FIELD_COLUMNS[key]
        if (!column) return
        values.push(value)
        sets.push(`${column} = $${values.length}`)
    })
    if (!sets.length) return exports.findById(id)
    values.push(id)
    const { rows } = await query(
        `UPDATE users SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING ${COLUMNS}`,
        values
    )
    return shape(rows[0])
}

exports.incrementWallet = async (id, delta) => {
    await query('UPDATE users SET wallet_balance = wallet_balance + $1, updated_at = now() WHERE id = $2', [delta, id])
}

exports.incrementLoyaltyPoints = async (id, delta) => {
    await query('UPDATE users SET loyalty_points = loyalty_points + $1, updated_at = now() WHERE id = $2', [delta, id])
}
