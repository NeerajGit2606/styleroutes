const Order = require("../models/Order");
const User = require("../models/User");
const { sendMail } = require("../utils/Emails");

const LOYALTY_POINTS_PER_RUPEE = 0.01 // 1 point per ₹100 spent

const statusEmailCopy = {
    'Pending': { subject: 'Order Received', line: 'We have received your order and it is being processed.' },
    'Dispatched': { subject: 'Order Dispatched', line: 'Your order has been dispatched and is on its way.' },
    'Out for delivery': { subject: 'Out for Delivery', line: 'Your order is out for delivery and should arrive soon.' },
    'Delivered': { subject: 'Order Delivered', line: 'Your order has been delivered. We hope you love it!' },
    'Cancelled': { subject: 'Order Cancelled', line: 'Your order has been cancelled.' },
}

const sendOrderStatusEmail = async (order, status) => {
    try {
        const user = await User.findById(order.user)
        if (!user?.email) return
        const copy = statusEmailCopy[status] || { subject: 'Order Update', line: `Your order status is now: ${status}.` }
        await sendMail(
            user.email,
            `${copy.subject} - Order #${order._id}`,
            `<p>Hi ${user.name},</p><p>${copy.line}</p><p><b>Order ID:</b> ${order._id}<br/><b>Total:</b> ₹${order.total}</p><p>Thank you for shopping with us.</p>`
        )
    } catch (error) {
        console.log('Order status email failed:', error.message);
    }
}

// NOTE: coupon re-validation is parked with the Mongoose Coupon model — not
// part of this phase, so couponCode is ignored if the client sends one.
exports.create = async (req, res) => {
    try {
        const body = { ...req.body }
        delete body.couponCode
        body.discountAmount = 0

        // ── Wallet: never let it exceed the user's actual balance or the order total ──
        if (body.walletAmountUsed > 0) {
            const user = await User.findById(body.user)
            const usable = Math.min(body.walletAmountUsed, user?.walletBalance || 0, body.total)
            body.walletAmountUsed = Math.max(0, Math.round(usable * 100) / 100)
            body.total = Math.max(0, body.total - body.walletAmountUsed)
            if (body.walletAmountUsed > 0) {
                await User.incrementWallet(body.user, -body.walletAmountUsed)
            }
        }

        body.loyaltyPointsEarned = Math.round(body.total * LOYALTY_POINTS_PER_RUPEE)
        body.statusHistory = [{ status: 'Pending', note: 'Order placed', updatedAt: new Date() }]

        const created = await Order.create(body)

        if (created.loyaltyPointsEarned > 0) {
            await User.incrementLoyaltyPoints(created.user, created.loyaltyPointsEarned)
        }

        sendOrderStatusEmail(created, 'Pending')

        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating an order, please trying again later' })
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Order.findByUserId(id)
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching orders, please trying again later' })
    }
}

exports.getAll = async (req, res) => {
    try {
        let skip = 0
        let limit

        if (req.query.page && req.query.limit) {
            const pageSize = Number(req.query.limit)
            const page = Number(req.query.page)
            skip = pageSize * (page - 1)
            limit = pageSize
        }

        const { orders, total } = await Order.findAll({ skip, limit })

        res.header("X-Total-Count", total)
        res.status(200).json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' })
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const existing = await Order.findById(id)
        if (!existing) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const statusChanged = req.body.status && req.body.status !== existing.status
        const historyEntry = statusChanged ? { status: req.body.status, note: req.body.note || '' } : undefined

        if (statusChanged && req.body.status === 'Cancelled' && existing.status !== 'Cancelled') {
            // ── Cancellation: reverse the wallet debit and the loyalty points earned ──
            if (existing.walletAmountUsed > 0) {
                await User.incrementWallet(existing.user, existing.walletAmountUsed)
            }
            if (existing.loyaltyPointsEarned > 0) {
                await User.incrementLoyaltyPoints(existing.user, -existing.loyaltyPointsEarned)
            }
        }

        const updated = await Order.updateById(id, req.body, historyEntry)

        if (statusChanged) {
            sendOrderStatusEmail(updated, req.body.status)
        }

        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating order, please try again later' })
    }
}

exports.getAnalytics = async (req, res) => {
    try {
        const analytics = await Order.getAnalytics()
        res.status(200).json(analytics)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching analytics, please try again later' })
    }
}
