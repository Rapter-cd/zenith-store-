import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user cart
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user._id }).populate('cart_items.product_id');
        if (!cart) {
            cart = await Cart.create({ user_id: req.user._id, cart_items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sync entire cart (overwrites current items, useful for initial login sync)
router.post('/sync', protect, async (req, res) => {
    try {
        const { cart_items } = req.body;
        let cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart) {
            cart = new Cart({ user_id: req.user._id, cart_items: cart_items || [] });
        } else {
            // Very simple overwrite for this scope
            cart.cart_items = cart_items || [];
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update cart items
router.put('/', protect, async (req, res) => {
    try {
        const { cart_items } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { user_id: req.user._id },
            { cart_items },
            { new: true, upsert: true }
        ).populate('cart_items.product_id');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
