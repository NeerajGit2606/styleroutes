/**
 * syncProducts.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-command sync: fetches ALL products from dummyjson.com API and upserts
 * them into your MongoDB (Categories → Brands → Products).
 *
 * Features:
 *   ✅ Idempotent — run anytime, no duplicates (uses upsert on title+brand)
 *   ✅ Real product data: titles, descriptions, prices, discount, stock, images
 *   ✅ Proper category & brand ObjectId references
 *   ✅ averageRating field populated from API
 *   ✅ Handles Add / Update / soft-Delete
 *
 * Usage:
 *   node seed/syncProducts.js               ← add/update products
 *   node seed/syncProducts.js --wipe        ← drop all + fresh seed
 *   node seed/syncProducts.js --sync-deletes← also soft-delete removed products
 *
 * Node 18+: built-in fetch works. Node <18: npm install node-fetch first.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const mongoose = require('mongoose')

const Category = require('../models/Category')
const Brand    = require('../models/Brand')
const Product  = require('../models/Product')

const API_BASE = 'https://dummyjson.com'
const args     = process.argv.slice(2)
const WIPE         = args.includes('--wipe')
const SYNC_DELETES = args.includes('--sync-deletes')

async function apiFetch(path) {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error(`API error ${res.status} → ${API_BASE}${path}`)
    return res.json()
}

async function sync() {
    // ── 1. Connect ────────────────────────────────────────────────────────
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to DB\n')

    // ── 2. Optional wipe ──────────────────────────────────────────────────
    if (WIPE) {
        await Promise.all([
            Category.deleteMany({}),
            Brand.deleteMany({}),
            Product.deleteMany({}),
        ])
        console.log('🗑️  Wiped existing Categories, Brands, Products\n')
    }

    // ── 3. Fetch all products (limit=0 = all 194 products from dummyjson) ─
    console.log('🌐 Fetching from dummyjson.com ...')
    const { products: raw, total } = await apiFetch(
        '/products?limit=0&select=id,title,description,price,discountPercentage,stock,rating,category,brand,thumbnail,images'
    )
    console.log(`   → ${raw.length} products fetched (API total: ${total})\n`)

    // ── 4. Upsert Categories ──────────────────────────────────────────────
    const categoryNames = [...new Set(raw.map(p => p.category))]
    console.log(`📂 Upserting ${categoryNames.length} categories...`)
    const categoryMap = {}
    for (const name of categoryNames) {
        const doc = await Category.findOneAndUpdate(
            { name },
            { name },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        categoryMap[name] = doc._id
    }

    // ── 5. Upsert Brands ──────────────────────────────────────────────────
    const brandNames = [...new Set(raw.map(p => p.brand))]
    console.log(`🏷️  Upserting ${brandNames.length} brands...`)
    const brandMap = {}
    for (const name of brandNames) {
        const doc = await Brand.findOneAndUpdate(
            { name },
            { name },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        brandMap[name] = doc._id
    }

    // ── 6. Upsert Products ────────────────────────────────────────────────
    console.log(`\n📦 Upserting ${raw.length} products...`)
    let added = 0, updated = 0, failed = 0

    for (const p of raw) {
        try {
            const categoryId = categoryMap[p.category]
            const brandId    = brandMap[p.brand]

            if (!categoryId || !brandId) {
                console.warn(`   ⚠ Skipping "${p.title}" — missing ref`)
                failed++
                continue
            }

            // dummyjson v2 uses /products/images/{id}/ pattern
            const thumbnail = p.thumbnail
                || `https://cdn.dummyjson.com/products/images/${p.id}/thumbnail.webp`

            const images = p.images?.length
                ? p.images
                : [`https://cdn.dummyjson.com/products/images/${p.id}/1.webp`]

            const data = {
                title:              p.title,
                description:        p.description,
                price:              p.price,
                discountPercentage: p.discountPercentage ?? 0,
                stockQuantity:      p.stock ?? 10,
                category:           categoryId,
                brand:              brandId,
                thumbnail,
                images,
                averageRating:      p.rating ?? 0,
                isDeleted:          false,
            }

            // Match on title+brand so re-running never creates duplicates
            const before = await Product.findOne({ title: p.title, brand: brandId }).lean()
            await Product.findOneAndUpdate(
                { title: p.title, brand: brandId },
                { $set: data },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            before ? updated++ : added++

        } catch (err) {
            console.error(`   ✗ "${p.title}":`, err.message)
            failed++
        }
    }

    console.log(`\n   ➕ Added   : ${added}`)
    console.log(`   ✏️  Updated : ${updated}`)
    console.log(`   ✗  Failed  : ${failed}`)

    // ── 7. Optional soft-delete ───────────────────────────────────────────
    if (SYNC_DELETES) {
        const apiTitles = raw.map(p => p.title)
        const del = await Product.updateMany(
            { title: { $nin: apiTitles }, isDeleted: false },
            { $set: { isDeleted: true } }
        )
        console.log(`\n🗑️  Soft-deleted ${del.modifiedCount} products no longer in API`)
    }

    // ── 8. Final summary ──────────────────────────────────────────────────
    const [cats, brands, total_p, active] = await Promise.all([
        Category.countDocuments(),
        Brand.countDocuments(),
        Product.countDocuments(),
        Product.countDocuments({ isDeleted: false }),
    ])

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Sync complete!')
    console.log(`   Categories : ${cats}`)
    console.log(`   Brands     : ${brands}`)
    console.log(`   Products   : ${total_p} total  |  ${active} active`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await mongoose.disconnect()
    process.exit(0)
}

sync().catch(err => {
    console.error('\n❌ Sync failed:', err.message)
    process.exit(1)
})
