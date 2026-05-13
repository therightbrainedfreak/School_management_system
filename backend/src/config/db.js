import 'dotenv/config';
import mongoose from "mongoose";
import pino_logger from '../utils/pino.js';

const connectDB = async () => {
  pino_logger.info('Connecting to MongoDB')
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1); // Exit process with failure
  }
};

mongoose.connection.on('connected', () => pino_logger.info('MongoDB connected'));
mongoose.connection.on('error', (err) => pino_logger.fatal({error: err}, 'Failed to connect to MongoDB'));
mongoose.connection.on('disconnected', () => pino_logger.error('MongoDB disconnected'));

export default connectDB;