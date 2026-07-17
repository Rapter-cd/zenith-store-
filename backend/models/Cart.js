import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cart_items: [cartItemSchema]
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
