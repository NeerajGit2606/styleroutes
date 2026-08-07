const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");

// NOTE: OTP email verification, forgot/reset-password, and Google OAuth are
// parked for now (they depend on the still-Mongoose OTP/PasswordResetToken
// models, out of scope for this phase). Signup verifies users immediately.

const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
        maxAge: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
        httpOnly: true,
        secure: process.env.PRODUCTION === 'true' ? true : false
    })
}

exports.signup = async (req, res) => {
    try {
        const existingUser = await User.findByEmail(req.body.email)

        if (existingUser) {
            return res.status(400).json({ "message": "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        const secureInfo = sanitizeUser(createdUser)
        const token = generateToken(secureInfo)
        setAuthCookie(res, token)

        res.status(201).json(secureInfo)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured during signup, please try again later" })
    }
}

exports.login = async (req, res) => {
    try {
        const existingUser = await User.findByEmail(req.body.email)

        if (existingUser && (await bcrypt.compare(req.body.password, existingUser.password))) {
            const secureInfo = sanitizeUser(existingUser)
            const token = generateToken(secureInfo)
            setAuthCookie(res, token)
            return res.status(200).json(secureInfo)
        }

        res.clearCookie('token');
        return res.status(404).json({ message: "Invalid Credentails" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occured while logging in, please try again later' })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie('token', {
            maxAge: 0,
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false
        })
        res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        console.log(error);
    }
}

exports.checkAuth = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id)
            return res.status(200).json(sanitizeUser(user))
        }
        res.sendStatus(401)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

// Lets a shopper check out without creating a real password-based account.
// A lightweight isGuest user is created behind the scenes so the rest of the
// app (cart/order, keyed by userId) works completely unchanged.
exports.guestCheckout = async (req, res) => {
    try {
        const { name, email } = req.body

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" })
        }

        let user = await User.findByEmail(email)

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10)
            user = await User.create({ name, email, password: randomPassword, isGuest: true, isVerified: true })
        }

        const secureInfo = sanitizeUser(user)
        const token = generateToken(secureInfo)
        setAuthCookie(res, token)

        res.status(200).json(secureInfo)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error starting guest checkout, please try again later" })
    }
}
