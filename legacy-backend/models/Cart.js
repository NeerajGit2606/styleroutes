const { query } = require('../database/db')

const SELECT_COLUMNS = `
    ci.id, ci.user_id, ci.quantity, ci.reminder_sent, ci.created_at, ci.updated_at,
    p.id AS product_id, p.title, p.description, p.price, p.discount_percentage,
    p.stock_quantity, p.thumbnail, p.images, p.is_deleted, p.variants,
    p.available_sizes, p.available_colors, p.average_rating,
    c.id AS category_id, c.name AS category_name,
    b.id AS brand_id, b.name AS brand_name
`

const FROM_JOIN = `
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    JOIN categories c ON c.id = p.category_id
    JOIN brands b ON b.id = p.brand_id
`

const shape = (row) => row && ({
    _id: String(row.id),
    user: String(row.user_id),
    product: {
        _id: String(row.product_id),
        title: row.title,
        description: row.description,
        price: Number(row.price),
        discountPercentage: Number(row.discount_percentage),
        category: { _id: String(row.category_id), name: row.category_name },
        brand: { _id: String(row.brand_id), name: row.brand_name },
        stockQuantity: row.stock_quantity,
        thumbnail: row.thumbnail,
        images: row.images,
        isDeleted: row.is_deleted,
        variants: row.variants,
        availableSizes: row.available_sizes,
        availableColors: row.available_colors,
        averageRating: Number(row.average_rating),
    },
    quantity: row.quantity,
    reminderSent: row.reminder_sent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})

exports.create = async ({ user, product, quantity = 1 }) => {
    const { rows } = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING id',
        [user, product, quantity]
    )
    return exports.findById(rows[0].id)
}

exports.findById = async (id) => {
    const { rows } = await query(`SELECT ${SELECT_COLUMNS} ${FROM_JOIN} WHERE ci.id = $1`, [id])
    return shape(rows[0])
}

exports.findByUserId = async (userId) => {
    const { rows } = await query(`SELECT ${SELECT_COLUMNS} ${FROM_JOIN} WHERE ci.user_id = $1 ORDER BY ci.id`, [userId])
    return rows.map(shape)
}

exports.updateById = async (id, { quantity }) => {
    await query('UPDATE cart_items SET quantity = $1, updated_at = now() WHERE id = $2', [quantity, id])
    return exports.findById(id)
}

exports.deleteById = async (id) => {
    const existing = await exports.findById(id)
    await query('DELETE FROM cart_items WHERE id = $1', [id])
    return existing
}

exports.deleteByUserId = async (userId) => {
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId])
}

exports.findStaleUnreminded = async (cutoff) => {
    const { rows } = await query(
        `SELECT ${SELECT_COLUMNS} ${FROM_JOIN} WHERE ci.updated_at <= $1 AND ci.reminder_sent = false`,
        [cutoff]
    )
    return rows.map(shape)
}

exports.markReminderSent = async (ids) => {
    if (!ids.length) return
    await query('UPDATE cart_items SET reminder_sent = true WHERE id = ANY($1::bigint[])', [ids])
}
