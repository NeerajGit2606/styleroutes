const { verifyToken } = require('../middleware/VerifyToken')

// Auth = sirf login check
exports.authMiddleware = verifyToken

// Admin = login check + admin role check  
exports.adminMiddleware = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'admin' || req.user?.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "Admin access required" })
        }
    })
}