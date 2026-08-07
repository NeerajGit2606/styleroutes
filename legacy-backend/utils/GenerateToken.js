require('dotenv').config()
const jwt=require('jsonwebtoken')

exports.generateToken = (payload, passwordReset = false) => {
    const expiry = passwordReset
        ? (process.env.PASSWORD_RESET_TOKEN_EXPIRATION || '15m')
        : (process.env.LOGIN_TOKEN_EXPIRATION || '7d')

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expiry })
}