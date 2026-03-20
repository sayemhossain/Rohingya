import mongoose from "mongoose";

// Read MONGODB_URI inside the function, not at module load time.
// On Vercel serverless, env vars may not be available at import time.
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  await mongoose.connect(uri, {
    bufferCommands: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  console.log("MongoDB connected successfully");
}

export default mongoose;
