const User = require("../models/User")

exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findById(id)
        delete result.password
        res.status(200).json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting your details, please try again later' })
    }
}
exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await User.updateById(id, req.body)
        delete updated.password
        res.status(200).json(updated)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting your details, please try again later' })
    }
}
