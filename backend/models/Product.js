import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    image_url: { type: String },
    image_public_id: { type: String },
    stock_quantity: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
