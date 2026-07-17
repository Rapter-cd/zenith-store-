import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const setRefreshTokenCookie = async (res, user_id, refreshToken) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        user_id,
        token: refreshToken,
        expiresAt
    });

    res.cookie('zenith_refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ full_name, email, password });
        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            await setRefreshTokenCookie(res, user._id, refreshToken);

            res.status(201).json({
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                token: accessToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            await setRefreshTokenCookie(res, user._id, refreshToken);

            res.json({
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                token: accessToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.zenith_refresh;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const tokenDoc = await RefreshToken.findOne({ token: refreshToken, user_id: decoded.id });
        
        if (!tokenDoc) return res.status(401).json({ message: 'Invalid refresh token' });

        const newAccessToken = generateAccessToken(decoded.id);
        res.json({ token: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.zenith_refresh;
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }
        res.clearCookie('zenith_refresh');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' });
    }
});

router.get('/profile', protect, async (req, res) => {
    const user = req.user;
    if (user) {
        res.json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

export default router;
