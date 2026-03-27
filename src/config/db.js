import 'dotenv/config';
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1); // Exit process with failure
  }
};

mongoose.connection.on('connected', () => console.log('✅ MongoDB: Connected'));
mongoose.connection.on('error', (err) => console.log(`❌ MongoDB: Error ${err}`));
mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB: Disconnected'));
mongoose.connection.on('reconnected', () => console.log('♻️ MongoDB: Reconnected'));

export default connectDB;