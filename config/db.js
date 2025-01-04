import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB...');
    console.log('Connected to MongoDB...');
  } catch (error) {
    logger.error('MongoDB connection error', error.message);
    console.error('MongoDB connection error', error.message);
    process.exit(1);
  }
};

export default connectDB;
