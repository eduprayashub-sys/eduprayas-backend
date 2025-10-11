import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eduprayas";

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop server if connection fails
  }
};

export default connectDB;
