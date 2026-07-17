import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://zenith-store-eight.vercel.app'],
    credentials: true
}));
app.use(cookieParser());

// Cashfree webhook needs raw body for signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
