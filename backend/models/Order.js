import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_items: [orderItemSchema],
    total_price: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'] },
    cashfreeOrderId: { type: String, unique: true, sparse: true },
    webhookProcessed: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
