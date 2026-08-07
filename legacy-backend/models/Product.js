const { query } = require('../database/db')

const SELECT_COLUMNS = `
    p.id, p.title, p.description, p.price, p.discount_percentage,
    p.stock_quantity, p.thumbnail, p.images, p.is_deleted, p.variants,
    p.available_sizes, p.available_colors, p.average_rating,
    p.created_at, p.updated_at,
    c.id AS category_id, c.name AS category_name,
    b.id AS brand_id, b.name AS brand_name
`

const FROM_JOIN = `
    FROM products p
    JOIN categories c ON c.id = p.category_id
    JOIN brands b ON b.id = p.brand_id
`

const shape = (row) => row && ({
    _id: String(row.id),
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})

const SORT_COLUMNS = {
    title: 'p.title',
    price: 'p.price',
    createdAt: 'p.created_at',
    averageRating: 'p.average_rating',
    stockQuantity: 'p.stock_quantity',
}

// Builds a shared WHERE clause (+ params) from the same filter options used
// by both the paginated select and the total-count query.
const buildWhere = ({ categoryIds, brandIds, onlyNotDeleted, search, priceMin, priceMax }) => {
    const clauses = []
    const params = []

    if (categoryIds?.length) {
        params.push(categoryIds)
        clauses.push(`p.category_id = ANY($${params.length}::bigint[])`)
    }
    if (brandIds?.length) {
        params.push(brandIds)
        clauses.push(`p.brand_id = ANY($${params.length}::bigint[])`)
    }
    if (onlyNotDeleted) {
        clauses.push('p.is_deleted = false')
    }
    if (search) {
        params.push(`%${search}%`)
        clauses.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`)
    }
    if (priceMin !== undefined) {
        params.push(priceMin)
        clauses.push(`p.price >= $${params.length}`)
    }
    if (priceMax !== undefined) {
        params.push(priceMax)
        clauses.push(`p.price <= $${params.length}`)
    }

    return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

exports.findAll = async (options = {}) => {
    const { where, params } = buildWhere(options)
    const sortColumn = SORT_COLUMNS[options.sortBy] || 'p.created_at'
    const sortOrder = options.sortOrder === 'desc' ? 'DESC' : 'ASC'

    const countResult = await query(`SELECT COUNT(*) ${FROM_JOIN} ${where}`, params)
    const total = Number(countResult.rows[0].count)

    let sql = `SELECT ${SELECT_COLUMNS} ${FROM_JOIN} ${where} ORDER BY ${sortColumn} ${sortOrder}`
    const selectParams = [...params]
    if (options.limit) {
        selectParams.push(options.limit)
        sql += ` LIMIT $${selectParams.length}`
        selectParams.push(options.skip || 0)
        sql += ` OFFSET $${selectParams.length}`
    }

    const { rows } = await query(sql, selectParams)
    return { products: rows.map(shape), total }
}

exports.findById = async (id) => {
    const { rows } = await query(`SELECT ${SELECT_COLUMNS} ${FROM_JOIN} WHERE p.id = $1`, [id])
    return shape(rows[0])
}

exports.create = async (data) => {
    const { rows } = await query(
        `INSERT INTO products
            (title, description, price, discount_percentage, category_id, brand_id,
             stock_quantity, thumbnail, images, variants, available_sizes, available_colors)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id`,
        [
            data.title, data.description, data.price, data.discountPercentage || 0,
            data.category, data.brand, data.stockQuantity, data.thumbnail,
            data.images, JSON.stringify(data.variants || []),
            data.availableSizes || [], JSON.stringify(data.availableColors || []),
        ]
    )
    return exports.findById(rows[0].id)
}

const UPDATABLE_FIELDS = {
    title: 'title',
    description: 'description',
    price: 'price',
    discountPercentage: 'discount_percentage',
    category: 'category_id',
    brand: 'brand_id',
    stockQuantity: 'stock_quantity',
    thumbnail: 'thumbnail',
    images: 'images',
    isDeleted: 'is_deleted',
    variants: 'variants',
    availableSizes: 'available_sizes',
    availableColors: 'available_colors',
    averageRating: 'average_rating',
}
const JSONB_FIELDS = new Set(['variants', 'availableColors'])

exports.updateById = async (id, fields) => {
    const sets = []
    const values = []
    Object.entries(fields).forEach(([key, value]) => {
        const column = UPDATABLE_FIELDS[key]
        if (!column) return
        values.push(JSONB_FIELDS.has(key) ? JSON.stringify(value) : value)
        sets.push(`${column} = $${values.length}`)
    })
    if (!sets.length) return exports.findById(id)
    values.push(id)
    await query(`UPDATE products SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length}`, values)
    return exports.findById(id)
}

exports.getRecommendations = async (id) => {
    const { rows } = await query(
        `SELECT ${SELECT_COLUMNS} ${FROM_JOIN}
         WHERE p.category_id = (SELECT category_id FROM products WHERE id = $1)
           AND p.id != $1
           AND p.is_deleted = false
         LIMIT 8`,
        [id]
    )
    return rows.map(shape)
}

exports.findCategoryByName = async (name) => {
    const { rows } = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [name])
    return rows[0]?.id
}

exports.findBrandByName = async (name) => {
    const { rows } = await query('SELECT id FROM brands WHERE LOWER(name) = LOWER($1)', [name])
    return rows[0]?.id
}

exports.bulkInsert = async (rows) => {
    for (const row of rows) {
        await query(
            `INSERT INTO products (title, description, price, discount_percentage, category_id, brand_id, stock_quantity, thumbnail, images)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [row.title, row.description, row.price, row.discountPercentage, row.category, row.brand, row.stockQuantity, row.thumbnail, row.images]
        )
    }
}
