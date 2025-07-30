import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import quoteRoutes from './routes/quotes';
import logger from './utils/logger';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', quoteRoutes);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI || '', {})
  .then(() => {
    logger.info(`MongoDB connected`);
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });
