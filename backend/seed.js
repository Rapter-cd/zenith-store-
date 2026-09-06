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
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life, multipoint Bluetooth connection, and crystal-clear call quality. Foldable design for easy portability.",
    price: 24999,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock_quantity: 30
  },
  {
    name: "Apple Watch Series 9 (GPS, 45mm)",
    description: "Advanced health sensors including blood oxygen and ECG, crash detection, always-on Retina display, and up to 18 hours of battery life. Water resistant up to 50 metres.",
    price: 41900,
    category: "Wearables",
    image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    stock_quantity: 25
  },
  {
    name: "Keychron K2 Pro Mechanical Keyboard",
    description: "Compact 75% layout with hot-swappable switches, per-key RGB backlighting, and both wireless and wired connectivity. Compatible with Mac and Windows.",
    price: 8999,
    category: "Peripherals",
    image_url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    stock_quantity: 40
  },
  {
    name: "Dell 27\" QHD IPS Monitor (S2722DC)",
    description: "2560x1440 QHD resolution, 75Hz refresh rate, USB-C 65W charging, and built-in dual 5W speakers. Thin bezel design with height-adjustable stand for ergonomic use.",
    price: 32500,
    category: "Monitors",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    stock_quantity: 15
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    description: "Ultra-fast MagSpeed electromagnetic scrolling, 8K DPI tracking on any surface, ergonomic thumb rest, and up to 70 days on a full charge. Works across 3 devices.",
    price: 9995,
    category: "Peripherals",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    stock_quantity: 50
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    description: "24-bit Hi-Fi audio, intelligent ANC, 360 Audio, and IPX7 water resistance. Comfortable ergonomic design with up to 8 hours of playback and 29 hours with the case.",
    price: 14999,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    stock_quantity: 35
  },
  {
    name: "Anker 65W GaN USB-C Charger",
    description: "Compact foldable 3-port charger (2x USB-C, 1x USB-A) using GaN technology. Simultaneously charge a laptop, tablet, and smartphone. Universal compatibility.",
    price: 3499,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    stock_quantity: 80
  },
  {
    name: "GoPro HERO12 Black Action Camera",
    description: "5.3K60 video, 27MP photos, HyperSmooth 6.0 stabilization, and up to 70 minutes of underwater shooting at 10m. Includes 1-year GoPro subscription.",
    price: 39500,
    category: "Cameras",
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    stock_quantity: 18
  },
  {
    name: "Xiaomi Smart Band 8 Pro",
    description: "1.74\" AMOLED display, 150+ fitness modes, 14-day battery life, SpO2 and stress monitoring. Swim-proof with 5ATM water resistance.",
    price: 4499,
    category: "Wearables",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
    stock_quantity: 60
  },
  {
    name: "TP-Link Deco XE75 Wi-Fi 6E Mesh Router",
    description: "Tri-band 6GHz Wi-Fi 6E with up to 5400 Mbps speeds. Covers up to 540 sq.m., supports 200+ devices, includes built-in antivirus and parental controls.",
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
