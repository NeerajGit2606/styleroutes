import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import LockIcon from '@mui/icons-material/Lock';
import { Stack, Typography } from '@mui/material';
import { createRazorpayOrder, verifyRazorpayPayment } from './PaymentApi';

// Razorpay checkout script dynamically load karta hai
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ─────────────────────────────────────────────────────────────────────────────
// RazorpayButton
//
// Props:
//   total       — number  — grand total in INR (e.g. 1050.55)
//   userEmail   — string  — prefill in Razorpay popup
//   userName    — string  — prefill in Razorpay popup
//   onSuccess   — fn({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
//   onError     — fn(message)
//   disabled    — bool
// ─────────────────────────────────────────────────────────────────────────────
export const RazorpayButton = ({ total, userEmail, userName, onSuccess, onError, disabled }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        // 1. Razorpay script load karo
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            onError('Razorpay load nahi hua, internet check karo');
            setLoading(false);
            return;
        }

        try {
            // 2. Backend se Razorpay order banao
            const { orderId, amount, currency, keyId } = await createRazorpayOrder(total);

            // 3. Razorpay checkout popup open karo
            const options = {
                key: keyId,
                amount,
                currency,
                name: 'MERN Shop',
                description: 'Order Payment',
                order_id: orderId,
                prefill: {
                    name: userName || '',
                    email: userEmail || '',
                },
                theme: { color: '#1976d2' },

                handler: async (response) => {
                    // 4. Payment success — verify karo backend se
                    try {
                        const verified = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verified.verified) {
                            onSuccess({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                        } else {
                            onError('Payment verification failed, please contact support');
                        }
                    } catch (err) {
                        onError('Payment verification error');
                    }
                    setLoading(false);
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response) => {
                onError(response.error.description || 'Payment failed');
                setLoading(false);
            });
            rzp.open();

        } catch (error) {
            onError('Payment initiation failed, please try again');
            setLoading(false);
        }
    };

    return (
        <Stack rowGap={1}>
            <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                loading={loading}
                onClick={handlePayment}
                disabled={disabled || loading}
                startIcon={!loading && <LockIcon fontSize="small" />}
            >
                Pay Securely with Razorpay
            </LoadingButton>
            <Stack flexDirection="row" alignItems="center" justifyContent="center" columnGap={0.5}>
                <LockIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled">
                    Secured by Razorpay · UPI, Cards, NetBanking supported
                </Typography>
            </Stack>
        </Stack>
    );
};
