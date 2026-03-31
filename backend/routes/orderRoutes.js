import express from 'express';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const { order_items, total_price } = req.body;
        if (order_items && order_items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                user_id: req.user._id,
                order_items,
                total_price
            });
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user_id', 'full_name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user_id', 'id full_name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
