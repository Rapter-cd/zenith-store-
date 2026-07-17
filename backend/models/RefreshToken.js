import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }, // Store raw token securely or hashed. For simplicity/tutorial context, we store it.
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL index to automatically remove expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
