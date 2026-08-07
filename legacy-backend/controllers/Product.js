const { parse } = require("csv-parse/sync")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        const created = await Product.create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding product, please trying again later' })
    }
}

const asArray = (value) => !value ? undefined : (Array.isArray(value) ? value : [value])

exports.getAll = async (req, res) => {
    try {
        const options = {
            categoryIds: asArray(req.query.category),
            brandIds: asArray(req.query.brand),
            onlyNotDeleted: Boolean(req.query.user),
            search: req.query.search?.trim() || undefined,
            sortBy: req.query.sort,
            sortOrder: req.query.order,
        }

        // priceMin=0 is a legit filter value — check for undefined/empty, not truthiness
        if (req.query.priceMin !== undefined && req.query.priceMin !== '') options.priceMin = Number(req.query.priceMin)
        if (req.query.priceMax !== undefined && req.query.priceMax !== '') options.priceMax = Number(req.query.priceMax)

        if (req.query.page && req.query.limit) {
            const pageSize = Number(req.query.limit)
            const page = Number(req.query.page)
            options.limit = pageSize
            options.skip = pageSize * (page - 1)
        }

        const { products, total } = await Product.findAll(options)

        res.set("X-Total-Count", total)
        res.status(200).json(products)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching products, please try again later' })
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Product.findById(id)
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting product details, please try again later' })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await Product.updateById(id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating product, please try again later' })
    }
}

exports.undeleteById = async (req, res) => {
    try {
        const { id } = req.params
        const unDeleted = await Product.updateById(id, { isDeleted: false })
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error restoring product, please try again later' })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Product.updateById(id, { isDeleted: true })
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting product, please try again later' })
    }
}

// Expected CSV columns: title,description,price,discountPercentage,category,brand,stockQuantity,thumbnail,images
// category/brand are matched by name (case-insensitive); images is a "|" separated list of URLs
exports.bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No CSV file uploaded' })
        }

        const records = parse(req.file.buffer.toString('utf-8'), {
            columns: true,
            skip_empty_lines: true,
            trim: true
        })

        if (!records.length) {
            return res.status(400).json({ message: 'CSV file is empty' })
        }

        const errors = []
        const toInsert = []

        for (const [index, row] of records.entries()) {
            const rowNum = index + 2 // account for header row

            if (!row.title || !row.description || !row.price || !row.stockQuantity || !row.thumbnail) {
                errors.push(`Row ${rowNum}: missing required field(s)`)
                continue
            }

            const categoryId = await Product.findCategoryByName(row.category || '')
            const brandId = await Product.findBrandByName(row.brand || '')

            if (!categoryId) {
                errors.push(`Row ${rowNum}: unknown category "${row.category}"`)
                continue
            }
            if (!brandId) {
                errors.push(`Row ${rowNum}: unknown brand "${row.brand}"`)
                continue
            }

            toInsert.push({
                title: row.title,
                description: row.description,
                price: Number(row.price),
                discountPercentage: Number(row.discountPercentage) || 0,
                category: categoryId,
                brand: brandId,
                stockQuantity: Number(row.stockQuantity),
                thumbnail: row.thumbnail,
                images: row.images ? row.images.split('|').map(s => s.trim()).filter(Boolean) : [row.thumbnail]
            })
        }

        if (toInsert.length) {
            await Product.bulkInsert(toInsert)
        }

        res.status(201).json({
            inserted: toInsert.length,
            failed: errors.length,
            errors
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error processing bulk upload, please check the CSV format and try again' })
    }
}

exports.getRecommendations = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const recommendations = await Product.getRecommendations(id)
        res.status(200).json(recommendations)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching recommendations, please try again later' })
    }
}
