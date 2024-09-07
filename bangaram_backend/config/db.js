import mongoose from 'mongoose';

const connectMongoDb = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        // Log error details
        console.error("MongoDB connection error:", err.message);
    }
};

export default connectMongoDb;