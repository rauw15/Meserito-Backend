import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'meserito_test';

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
