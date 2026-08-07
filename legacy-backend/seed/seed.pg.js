// Postgres seed script — minimal data just to prove the core tables work
// end-to-end locally. Real kids-clothing catalog content (proper categories,
// curated images, product copy) is a separate follow-up phase.

require('dotenv').config()
const bcrypt = require('bcryptjs')
const { pool, query } = require('../database/db')

const PRODUCTS = [
    {
        title: 'Classic Denim Jeans', description: 'Comfortable straight-fit denim jeans for everyday wear.',
        price: 1199, category: 'Boys', brand: 'Cubwear', stockQuantity: 50,
        thumbnail: 'https://picsum.photos/seed/cubwear-jeans/600/800',
        images: ['https://picsum.photos/seed/cubwear-jeans/600/800'],
        availableSizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    },
    {
        title: 'Graphic Print T-Shirt', description: 'Soft cotton t-shirt with a fun graphic print.',
        price: 499, category: 'Boys', brand: 'Cubwear', stockQuantity: 80,
        thumbnail: 'https://picsum.photos/seed/cubwear-tshirt/600/800',
        images: ['https://picsum.photos/seed/cubwear-tshirt/600/800'],
        availableSizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    },
    {
        title: 'Cargo Shorts', description: 'Durable cargo shorts with multiple pockets, built for play.',
        price: 699, category: 'Boys', brand: 'Urban Cub', stockQuantity: 60,
        thumbnail: 'https://picsum.photos/seed/cubwear-shorts/600/800',
        images: ['https://picsum.photos/seed/cubwear-shorts/600/800'],
        availableSizes: ['4-5Y', '6-7Y', '8-9Y'],
    },
    {
        title: 'Hooded Sweatshirt', description: 'Warm fleece-lined hoodie for cooler days.',
        price: 999, category: 'Boys', brand: 'Urban Cub', stockQuantity: 40,
        thumbnail: 'https://picsum.photos/seed/cubwear-hoodie/600/800',
        images: ['https://picsum.photos/seed/cubwear-hoodie/600/800'],
        availableSizes: ['6-7Y', '8-9Y', '10-11Y', '12-13Y'],
    },
    {
        title: 'Baby Boy Romper Set', description: 'Soft cotton romper with snap buttons, easy to wear.',
        price: 799, category: 'Baby Boy', brand: 'Cubwear', stockQuantity: 35,
        thumbnail: 'https://picsum.photos/seed/cubwear-romper/600/800',
        images: ['https://picsum.photos/seed/cubwear-romper/600/800'],
        availableSizes: ['0-6M', '6-12M', '12-18M'],
    },
    {
        title: 'Baby Boy Dungaree', description: 'Adorable dungaree set with a matching bodysuit.',
        price: 899, category: 'Baby Boy', brand: 'Urban Cub', stockQuantity: 30,
        thumbnail: 'https://picsum.photos/seed/cubwear-dungaree/600/800',
        images: ['https://picsum.photos/seed/cubwear-dungaree/600/800'],
        availableSizes: ['6-12M', '12-18M', '18-24M'],
    },
]

const seed = async () => {
    console.log('Seeding Postgres [started]...')

    // Safe to re-run — clears core tables before reseeding.
    await query('TRUNCATE cart_items, orders, products, categories, brands, users RESTART IDENTITY CASCADE')

    const categoryIds = {}
    for (const name of ['Boys', 'Baby Boy']) {
        const { rows } = await query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name])
        categoryIds[name] = rows[0].id
    }

    const brandIds = {}
    for (const name of ['Cubwear', 'Urban Cub']) {
        const { rows } = await query('INSERT INTO brands (name) VALUES ($1) RETURNING id', [name])
        brandIds[name] = rows[0].id
    }

    for (const p of PRODUCTS) {
        await query(
            `INSERT INTO products (title, description, price, category_id, brand_id, stock_quantity, thumbnail, images, available_sizes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [p.title, p.description, p.price, categoryIds[p.category], brandIds[p.brand], p.stockQuantity, p.thumbnail, p.images, p.availableSizes]
        )
    }

    const adminPassword = await bcrypt.hash('Admin@123', 10)
    await query('INSERT INTO users (name, email, password, is_admin) VALUES ($1,$2,$3,true)', ['Admin', 'admin@cubwear.com', adminPassword])

    const userPassword = await bcrypt.hash('Test@123', 10)
    await query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3)', ['Test User', 'test@cubwear.com', userPassword])

    console.log(`Seeded ${PRODUCTS.length} products, 2 categories, 2 brands, 2 users.`)
    console.log('Login as admin@cubwear.com / Admin@123 or test@cubwear.com / Test@123')
    console.log('Seed completed.')
}

seed()
    .catch((err) => { console.error(err); process.exitCode = 1 })
    .finally(() => pool.end())
