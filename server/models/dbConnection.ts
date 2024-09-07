import mongoose from 'mongoose';

const database = () => {
  const validDBNames: string[] = ['development', 'production'];
  if (process.env.DATABASE === undefined) {
    console.log('Using development database');
    return 'development';
  } else if (validDBNames.includes(process.env.DATABASE)) {
    return process.env.DATABASE;
  } else {
    console.log(
      'Invalid database name - Using default database instead (development)',
    );
    return 'development';
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri == undefined) {
    throw new Error('URI not found in environment file.');
  }

  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
      dbName: database(),
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  }
};

export default connectDB;
