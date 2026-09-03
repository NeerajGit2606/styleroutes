import Razorpay from "razorpay";

export const RAZORPAY_ENABLED = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const razorpay = RAZORPAY_ENABLED
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  : null;
