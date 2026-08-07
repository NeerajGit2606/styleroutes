const { query } = require('../database/db')

const shape = (row) => row && ({
    _id: String(row.id),
    user: String(row.user_id),
    item: row.item,
    address: row.address,
    status: row.status,
    paymentMode: row.payment_mode,
    paymentStatus: row.payment_status,
    stripePaymentIntentId: row.payment_intent_id,
    total: Number(row.total),
    couponCode: row.coupon_code,
    discountAmount: Number(row.discount_amount),
    walletAmountUsed: Number(row.wallet_amount_used),
    loyaltyPointsEarned: row.loyalty_points_earned,
    statusHistory: row.status_history,
    createdAt: row.created_at,
})

exports.create = async (data) => {
    const { rows } = await query(
        `INSERT INTO orders
            (user_id, item, address, payment_mode, payment_status, total,
             coupon_code, discount_amount, wallet_amount_used, loyalty_points_earned, status_history)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [
            data.user, JSON.stringify(data.item), JSON.stringify(data.address),
            data.paymentMode, data.paymentStatus || 'unpaid', data.total,
            data.couponCode || null, data.discountAmount || 0, data.walletAmountUsed || 0,
            data.loyaltyPointsEarned || 0, JSON.stringify(data.statusHistory || []),
        ]
    )
    return exports.findById(rows[0].id)
}

exports.findById = async (id) => {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [id])
    return shape(rows[0])
}

exports.findByUserId = async (userId) => {
    const { rows } = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId])
    return rows.map(shape)
}

exports.findAll = async ({ skip = 0, limit } = {}) => {
    const countResult = await query('SELECT COUNT(*) FROM orders')
    const total = Number(countResult.rows[0].count)

    let sql = 'SELECT * FROM orders ORDER BY created_at DESC'
    const params = []
    if (limit) {
        params.push(limit)
        sql += ` LIMIT $${params.length}`
        params.push(skip)
        sql += ` OFFSET $${params.length}`
    }

    const { rows } = await query(sql, params)
    return { orders: rows.map(shape), total }
}

const UPDATABLE_FIELDS = {
    status: 'status',
    paymentStatus: 'payment_status',
    stripePaymentIntentId: 'payment_intent_id',
}

// historyEntry (optional) is appended to the JSONB status_history array —
// pass { status, note } and the timestamp is stamped here.
exports.updateById = async (id, fields, historyEntry) => {
    const sets = []
    const values = []
    Object.entries(fields).forEach(([key, value]) => {
        const column = UPDATABLE_FIELDS[key]
        if (!column) return
        values.push(value)
        sets.push(`${column} = $${values.length}`)
    })

    if (historyEntry) {
        values.push(JSON.stringify([{ ...historyEntry, updatedAt: new Date().toISOString() }]))
        sets.push(`status_history = status_history || $${values.length}::jsonb`)
    }

    if (!sets.length) return exports.findById(id)
    values.push(id)
    await query(`UPDATE orders SET ${sets.join(', ')} WHERE id = $${values.length}`, values)
    return exports.findById(id)
}

exports.getAnalytics = async () => {
    const [revenueResult, statusResult, salesByDayResult, topProductsResult, totalOrdersResult] = await Promise.all([
        query(`SELECT COALESCE(SUM(total), 0) AS revenue FROM orders WHERE status != 'Cancelled'`),
        query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status`),
        query(`
            SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS day, SUM(total) AS revenue, COUNT(*) AS orders
            FROM orders
            WHERE created_at >= now() - interval '30 days' AND status != 'Cancelled'
            GROUP BY day ORDER BY day
        `),
        query(`
            SELECT elem->'product'->>'_id' AS product_id,
                   elem->'product'->>'title' AS title,
                   SUM((elem->>'quantity')::int) AS quantity
            FROM orders, jsonb_array_elements(item) AS elem
            WHERE status != 'Cancelled'
            GROUP BY product_id, title
            ORDER BY quantity DESC
            LIMIT 5
        `),
        query('SELECT COUNT(*) FROM orders'),
    ])

    return {
        totalRevenue: Number(revenueResult.rows[0].revenue),
        totalOrders: Number(totalOrdersResult.rows[0].count),
        statusBreakdown: statusResult.rows.map(r => ({ _id: r.status, count: Number(r.count) })),
        salesByDay: salesByDayResult.rows.map(r => ({ _id: r.day, revenue: Number(r.revenue), orders: Number(r.orders) })),
        topProducts: topProductsResult.rows.map(r => ({ _id: r.product_id, title: r.title, quantity: Number(r.quantity) })),
    }
}
