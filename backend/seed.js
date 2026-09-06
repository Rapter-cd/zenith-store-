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
    name: "Wireless Over-Ear Noise-Cancelling Headphones",
    description: "Premium sound quality with active noise cancellation, 30-hour battery life, and multipoint Bluetooth connection. Foldable design with soft cushioned ear cups for all-day comfort.",
    price: 24999,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock_quantity: 30
  },
  {
    name: "Smart Fitness Smartwatch (45mm)",
    description: "Advanced health monitoring with blood oxygen, ECG, crash detection, and always-on display. Up to 18 hours battery life, water resistant up to 50 metres.",
    price: 41900,
    category: "Wearables",
    image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    stock_quantity: 25
  },
  {
    name: "75% Layout Wireless Mechanical Keyboard",
    description: "Compact hot-swappable mechanical keyboard with per-key RGB backlighting and wireless + wired connectivity. Compatible with Windows and macOS.",
    price: 8999,
    category: "Peripherals",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    stock_quantity: 40
  },
  {
    name: "27-inch QHD IPS Monitor",
    description: "2560x1440 QHD resolution, 75Hz refresh rate, USB-C 65W charging, and built-in dual speakers. Thin bezel with height-adjustable ergonomic stand.",
    price: 32500,
    category: "Monitors",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    stock_quantity: 15
  },
  {
    name: "Ergonomic Wireless Productivity Mouse",
    description: "Ultra-fast electromagnetic scrolling, precise tracking on any surface, comfortable thumb rest, and up to 70 days on a full charge. Pairs with up to 3 devices.",
    price: 9995,
    category: "Peripherals",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    stock_quantity: 50
  },
  {
    name: "True Wireless In-Ear Earbuds",
    description: "24-bit Hi-Fi audio with intelligent active noise cancellation, IPX7 water resistance, and up to 8 hours playback. Compact charging case provides 29 hours total.",
    price: 14999,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    stock_quantity: 35
  },
  {
    name: "65W GaN Multi-Port USB-C Charger",
    description: "Compact foldable 3-port charger (2× USB-C, 1× USB-A) using GaN technology. Simultaneously charges a laptop, tablet, and phone from a single plug.",
    price: 3499,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    stock_quantity: 80
  },
  {
    name: "4K Action Camera with Stabilisation",
    description: "5.3K video, 27MP photos, and advanced digital image stabilisation for smooth handheld footage. Waterproof up to 10m without a case. Includes mounting accessories.",
    price: 39500,
    category: "Cameras",
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    stock_quantity: 18
  },
  {
    name: "Smart Health & Fitness Band",
    description: "1.74-inch AMOLED display, 150+ exercise modes, 14-day battery, SpO2, heart rate, and stress tracking. Swim-proof with 5ATM water resistance.",
    price: 4499,
    category: "Wearables",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
    stock_quantity: 60
  },
  {
    name: "Wi-Fi 6E Tri-Band Mesh Router System",
    description: "Next-gen 6GHz Wi-Fi 6E with up to 5400 Mbps speeds. Covers large homes, supports 200+ devices, with built-in parental controls and network security.",
    price: 18999,
    category: "Networking",
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    stock_quantity: 20
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
