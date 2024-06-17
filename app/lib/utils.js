import mongoose from 'mongoose';

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  const MONGO_URL = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL_DEV;

  if (!MONGO_URL) {
    throw new Error('Please define the MONGO_URL environment variable');
  }

  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successfully established.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw new Error("Error connecting to MongoDB");
  }
};

export default connect;
