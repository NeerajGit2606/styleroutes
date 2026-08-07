const Cart = require('../models/Cart')

exports.create = async (req, res) => {
    try {
        const created = await Cart.create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding product to cart, please trying again later' })
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Cart.findByUserId(id)
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching cart items, please trying again later' })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await Cart.updateById(id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error updating cart items, please trying again later' })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Cart.deleteById(id)
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error deleting cart item, please trying again later' })
    }
}

exports.deleteByUserId = async (req, res) => {

    try {
        const { id } = req.params
        await Cart.deleteByUserId(id)
        res.sendStatus(204)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some Error occured while resetting your cart" })
    }

}
