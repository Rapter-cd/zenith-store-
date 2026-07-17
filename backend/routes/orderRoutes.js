import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { canTransition } from '../services/orderStateMachine.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { order_items, total_price, cashfreeOrderId } = req.body;
        if (order_items && order_items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'No order items' });
        } else {
            for (const item of order_items) {
                const updated = await Product.findOneAndUpdate(
                    { _id: item.product_id, stock_quantity: { $gte: item.quantity } },
                    { $inc: { stock_quantity: -item.quantity } },
                    { new: true, session }
                );
                if (!updated) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(409).json({ message: 'Item went out of stock during checkout.' });
                }
            }

            const order = new Order({
                user_id: req.user._id,
                order_items,
                total_price,
                cashfreeOrderId
            });
            const createdOrder = await order.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
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

router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!canTransition(order.status, status)) {
            return res.status(400).json({ message: `Invalid transition from ${order.status} to ${status}` });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
