import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find({});
        const revenue = orders.reduce((acc, order) => acc + order.total_price, 0);

        const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user_id', 'full_name');
        const recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        const lowStockProducts = await Product.find({ stock_quantity: { $lt: 5 } }).sort({ stock_quantity: 1 }).limit(10);

        res.json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                revenue
            },
            recentOrders,
            recentProducts,
            lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/users/:id/status', protect, admin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isActive = isActive;
        await user.save();
        res.json({ message: `User ${isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
