const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require("../middleware/VerifyToken");

// NOTE: OTP verification, forgot/reset-password, and Google OAuth routes are
// parked for now — they depend on the still-Mongoose OTP/PasswordResetToken
// models and passport config, out of scope for this phase.

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "neeraj@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass@123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/signup", authController.signup)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "neeraj@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass@123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", authController.login)

/**
 * @swagger
 * /auth/check-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Not authenticated
 */
router.get("/check-auth", verifyToken, authController.checkAuth)

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get("/logout", authController.logout)

/**
 * @swagger
 * /auth/guest-checkout:
 *   post:
 *     summary: Start checkout without a full account (creates a lightweight guest user)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Guest session started
 */
router.post("/guest-checkout", authController.guestCheckout)

module.exports = router
