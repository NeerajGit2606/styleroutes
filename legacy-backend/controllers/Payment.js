const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1 — Frontend calls this to create a Razorpay order
exports.createOrder = async (req, res) => {
    try {
        const { total } = req.body;

        if (!total || total <= 0) {
            return res.status(400).json({ message: "Invalid order total" });
        }

        const options = {
            amount: Math.round(total * 100), // paise mein (INR)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        res.status(201).json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating payment order, please try again later" });
    }
};

// Step 2 — Frontend calls this after successful payment to verify signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // HMAC SHA256 signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ verified: true, paymentId: razorpay_payment_id });
        } else {
            res.status(400).json({ verified: false, message: "Payment verification failed" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error verifying payment, please try again later" });
    }
};
