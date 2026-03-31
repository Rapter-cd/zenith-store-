import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("URI length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
}).then((conn) => {
    console.log("SUCCESS");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.exit(0);
}).catch((error) => {
    console.log("FAILED");
    console.error(error.message);
    process.exit(1);
});
