import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        const timestamp = req.headers['x-webhook-timestamp'];

        if (!signature || !timestamp) {
            return res.status(401).send('Missing signature headers');
        }

        const rawBody = req.body.toString('utf8');
        const signedString = `${timestamp}${rawBody}`;
        const expectedSignature = crypto.createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
            .update(signedString)
            .digest('base64');

        if (signature !== expectedSignature) {
            return res.status(401).send('Invalid signature');
        }

        const payload = JSON.parse(rawBody);

        // Process only payment success (adjust type based on actual Cashfree events)
        if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const cashfreeOrderId = payload.data.order.order_id;
            
            const order = await Order.findOneAndUpdate(
                { cashfreeOrderId: cashfreeOrderId, webhookProcessed: false },
                { $set: { webhookProcessed: true, status: 'Paid' } },
                { new: true }
            );

            if (!order) {
                return res.status(200).send('Already processed or not found');
            }
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook error');
    }
});

router.post('/create-order', protect, async (req, res) => {
    try {
        const { order_items, total_price, customer_details } = req.body;

        if (!order_items || order_items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const app_id = process.env.CASHFREE_APP_ID;
        const secret_key = process.env.CASHFREE_SECRET_KEY;
        const current_time = Date.now();
        const order_id = `order_${current_time}`;

        const payload = {
            order_amount: Math.round(total_price * 100) / 100,
            order_currency: 'INR',
            order_id: order_id,
            customer_details: customer_details
        };

        const response = await fetch('https://sandbox.cashfree.com/pg/orders', {
            method: 'POST',
            headers: {
                'x-client-id': app_id,
                'x-client-secret': secret_key,
                'x-api-version': '2023-08-01',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error occurred while creating Cashfree order');
        }

        res.json({
            payment_session_id: data.payment_session_id,
            order_id: data.order_id
        });
    } catch (error) {
        console.error('Cashfree order generation error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
