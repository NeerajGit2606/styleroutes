const { query } = require('../database/db')

const shape = (row) => row && ({ _id: String(row.id), name: row.name })

exports.findAll = async () => {
    const { rows } = await query('SELECT id, name FROM categories ORDER BY id')
    return rows.map(shape)
}

exports.findById = async (id) => {
    const { rows } = await query('SELECT id, name FROM categories WHERE id = $1', [id])
    return shape(rows[0])
}

exports.create = async (name) => {
    const { rows } = await query('INSERT INTO categories (name) VALUES ($1) RETURNING id, name', [name])
    return shape(rows[0])
}
