import React, { useState } from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Box, Stack, Typography, CircularProgress, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockIcon from '@mui/icons-material/Lock';

// Styles passed into Stripe's iframe elements
const getStripeElementStyle = (isDark) => ({
    style: {
        base: {
            fontSize: '16px',
            color: isDark ? '#ffffff' : '#1a1a1a',
            fontFamily: '"Roboto", sans-serif',
            '::placeholder': { color: isDark ? '#888' : '#aab7c4' },
        },
        invalid: { color: '#e53935' },
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// StripeCardForm
//
// Props:
//   clientSecret  — string   — from backend /payment/create-payment-intent
//   onSuccess     — fn(paymentIntent) — called after successful payment
//   onError       — fn(message)       — called when payment fails
//   loading       — bool              — disables button while order is saving
// ─────────────────────────────────────────────────────────────────────────────
export const StripeCardForm = ({ clientSecret, onSuccess, onError, loading }) => {
    const stripe = useStripe();
    const elements = useElements();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const elementStyle = getStripeElementStyle(isDark);

    const wrapperSx = {
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'}`,
        borderRadius: 1,
        px: 1.75,
        py: 1.5,
        '&:focus-within': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        },
    };

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        setProcessing(true);
        setCardError('');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
            },
        });

        setProcessing(false);

        if (error) {
            setCardError(error.message);
            onError && onError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            onSuccess && onSuccess(paymentIntent);
        }
    };

    return (
        <Stack rowGap={2.5}>
            {/* Card Number */}
            <Stack rowGap={0.5}>
                <Typography variant="body2" fontWeight={500}>Card Number</Typography>
                <Box sx={wrapperSx}>
                    <CardNumberElement options={elementStyle} />
                </Box>
            </Stack>

            {/* Expiry + CVC side by side */}
            <Stack flexDirection="row" columnGap={2}>
                <Stack rowGap={0.5} flex={1}>
                    <Typography variant="body2" fontWeight={500}>Expiry Date</Typography>
                    <Box sx={wrapperSx}>
                        <CardExpiryElement options={elementStyle} />
                    </Box>
                </Stack>
                <Stack rowGap={0.5} flex={1}>
                    <Typography variant="body2" fontWeight={500}>CVC</Typography>
                    <Box sx={wrapperSx}>
                        <CardCvcElement options={elementStyle} />
                    </Box>
                </Stack>
            </Stack>

            {/* Error message */}
            {cardError && (
                <Typography variant="body2" color="error">
                    {cardError}
                </Typography>
            )}

            {/* Pay button */}
            <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                loading={processing || loading}
                onClick={handleSubmit}
                disabled={!stripe || !clientSecret}
                startIcon={!processing && <LockIcon fontSize="small" />}
            >
                Pay Securely
            </LoadingButton>

            {/* Stripe badge */}
            <Stack flexDirection="row" alignItems="center" justifyContent="center" columnGap={0.5} mt={-1}>
                <LockIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled">
                    Secured by Stripe · PCI DSS compliant
                </Typography>
            </Stack>
        </Stack>
    );
};
