import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {
  MONGODB_URI,
  MONGODB_DATABASE
} = process.env;

if (!MONGODB_URI || !MONGODB_DATABASE) {
  throw new Error('MongoDB URI or database name is not provided in the environment variables.');
}

export const connectDatabase = async () => {
  try {
    await mongoose.connect(`${MONGODB_URI}/${MONGODB_DATABASE}`, {
      
    });
    console.log('Connected to MongoDB.');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error; // Re-throw the error to be caught by the caller
  }
};

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

export default mongoose;
