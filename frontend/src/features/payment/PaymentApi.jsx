import { axiosi } from "../../config/axios";

// Razorpay order banata hai backend se
export const createRazorpayOrder = async (total) => {
    const res = await axiosi.post("/payment/create-order", { total });
    return res.data; // { orderId, amount, currency, keyId }
};

// Payment signature verify karta hai backend se
export const verifyRazorpayPayment = async (paymentData) => {
    const res = await axiosi.post("/payment/verify", paymentData);
    return res.data; // { verified: true, paymentId }
};
