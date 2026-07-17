import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, cloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? { name: { $regex: req.query.search, $options: 'i' } }
            : {};

        const categoryFilter = req.query.category && req.query.category !== 'All'
            ? { category: req.query.category }
            : {};

        const filter = { ...keyword, ...categoryFilter };

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category, stock_quantity } = req.body;
        
        let image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
        let image_public_id = '';
        
        if (req.file) {
            image_url = req.file.path;
            image_public_id = req.file.filename;
        } else if (req.body.image_url) {
            image_url = req.body.image_url;
        }

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            image_url,
            image_public_id,
            description: description || 'Sample description',
            category: category || 'General',
            stock_quantity: stock_quantity || 0
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category, stock_quantity } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.stock_quantity = stock_quantity || product.stock_quantity;
            
            if (req.file) {
                // Delete old image from cloudinary if exists
                if (product.image_public_id) {
                    await cloudinary.uploader.destroy(product.image_public_id);
                }
                product.image_url = req.file.path;
                product.image_public_id = req.file.filename;
            } else if (req.body.image_url) {
                // If they provided a raw string URL instead of a file
                product.image_url = req.body.image_url;
            }
            
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            if (product.image_public_id) {
                await cloudinary.uploader.destroy(product.image_public_id);
            }
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
