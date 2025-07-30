import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.MONGO_PORT,
  mongoUri: process.env.MONGO_URI,
};
