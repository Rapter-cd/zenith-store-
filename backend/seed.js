import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const products = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Experience premium sound quality with industry-leading active noise cancellation.",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock_quantity: 45
  },
  {
    name: "Smart Watch Series 8",
    description: "Advanced health tracking, always-on display, and cellular connectivity.",
    price: 399.99,
    image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    stock_quantity: 30
  },
  {
    name: "Pro Gaming Keyboard",
    description: "Mechanical switches with RGB customizable lighting for the ultimate gaming setup.",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    stock_quantity: 15
  },
  {
    name: "4K Ultra HD Monitor",
    description: "27-inch 4K resolution with HDR support for stunning visuals.",
    price: 499.99,
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    stock_quantity: 10
  }
];

const seedDatabase = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();

        console.log("Existing Data Cleared!");

        await Product.insertMany(products);
        console.log("Mock Products Inserted Successfully!");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
